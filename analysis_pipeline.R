# =====================================================================
# ViVIM Pre-Registered Analysis Pipeline
# =====================================================================
# Usage:
#   Rscript analysis_pipeline.R <path_to_clean_csv>
#   Rscript analysis_pipeline.R                        # uses VIVIM_pilot_data_clean.csv fallback
#
# Input CSV columns: participant, condition, Intensity, Specificity, VVIQ2
# Outputs:
#   data/results.json   — BFs, stopping decision, N
#   reports/figures/    — Publication plots (PDF)

suppressPackageStartupMessages({
  if (!require("pacman", quietly=TRUE)) install.packages("pacman", repos="https://cloud.r-project.org")
  # Load tidyverse components individually to avoid readr/vroom (cpp11 issue on R 4.6.0)
  pacman::p_load(dplyr, tidyr, ggplot2, forcats, stringr,
                 afex, BayesFactor, psych, TOSTER, lme4, lmerTest, cocor, patchwork, jsonlite)
})

# --- CLI Args ---
args <- commandArgs(trailingOnly = TRUE)
csv_path <- if (length(args) >= 1) args[1] else "data/pilot_clean.csv"

REPORT_DIR <- "reports"
PLOT_DIR   <- file.path(REPORT_DIR, "figures")
DATA_DIR   <- "data"
for (d in c(REPORT_DIR, PLOT_DIR, DATA_DIR)) if (!dir.exists(d)) dir.create(d, recursive=TRUE)

# =====================================================================
# STEP 1: LOAD DATA
# =====================================================================
cat(">> Loading data from:", csv_path, "\n")

if (!file.exists(csv_path)) {
  stop(paste("CSV file not found:", csv_path))
}

df_agg <- read.csv(csv_path, stringsAsFactors = FALSE)

n_raw       <- n_distinct(df_agg$participant)
CONDITIONS  <- c("perceptual_recall", "episodic_recall", "scene_imagination")

df_agg <- df_agg %>%
  mutate(
    Participant = as.factor(participant),
    Condition   = factor(condition, levels = CONDITIONS)
  ) %>%
  filter(!is.na(Condition))

n_analyzed <- n_distinct(df_agg$Participant)
cat(sprintf("   N raw: %d | N with complete conditions: %d\n", n_raw, n_analyzed))

if (n_analyzed < 10) {
  cat("WARNING: fewer than 10 participants — BFs will be unreliable.\n")
}

# Reshape to long format for RM-ANOVA
df_long <- df_agg %>%
  pivot_longer(
    cols      = c(Intensity, Specificity),
    names_to  = "Dimension",
    values_to = "Score"
  ) %>%
  mutate(Dimension = factor(Dimension, levels = c("Intensity", "Specificity")))

df_spec <- df_long %>% filter(Dimension == "Specificity")

df_sub <- df_agg %>%
  group_by(Participant) %>%
  summarize(
    Intensity   = mean(Intensity, na.rm = TRUE),
    Specificity = mean(Specificity, na.rm = TRUE),
    VVIQ2       = first(VVIQ2),
    .groups     = "drop"
  )

cat(">> Data loaded. Proceeding to hypothesis testing...\n")
cat("----------------------------------------------------------\n")

# =====================================================================
# STEP 2: HYPOTHESIS TESTING
# =====================================================================

# --- H1: Dissociation (2x3 RM-ANOVA) ---
cat("== H1: Dissociation (Dimension x Condition interaction)\n")

freq_h1 <- afex::aov_ez(
  id = "Participant", dv = "Score",
  within = c("Dimension", "Condition"), data = df_long
)
print(summary(freq_h1))

bf_main            <- anovaBF(Score ~ Dimension * Condition + Participant,
                               data = df_long, whichRandom = "Participant", progress = FALSE)
bf_interaction_raw <- bf_main[4] / bf_main[3]
bf_H1              <- as.numeric(exp(bf_interaction_raw@bayesFactor$bf))
cat(sprintf("-> BF_inclusion (H1 Interaction): %.4f\n\n", bf_H1))


# --- H2a: Specificity Main Effect ---
cat("== H2a: Vividness Hierarchy (Specificity Main Effect)\n")

freq_h2a <- afex::aov_ez(
  id = "Participant", dv = "Score",
  within = "Condition", data = df_spec
)
print(summary(freq_h2a))

bf_h2a_obj <- anovaBF(Score ~ Condition + Participant,
                       data = df_spec, whichRandom = "Participant", progress = FALSE)
bf_H2a     <- as.numeric(exp(bf_h2a_obj@bayesFactor$bf))
cat(sprintf("-> BF_inclusion (H2a Specificity Main Effect): %.4f\n\n", bf_H2a))


# --- H2b: Directional Contrasts ---
cat("== H2b: Directional Contrasts (Perceptual > Episodic > Imagination)\n")

perc_scores <- df_spec %>% filter(Condition == "perceptual_recall") %>% pull(Score)
epis_scores <- df_spec %>% filter(Condition == "episodic_recall")   %>% pull(Score)
imag_scores <- df_spec %>% filter(Condition == "scene_imagination") %>% pull(Score)

bf_pe_obj <- ttestBF(perc_scores, epis_scores, paired = TRUE)
bf_ei_obj <- ttestBF(epis_scores, imag_scores, paired = TRUE)

bf_H2b_PE <- as.numeric(exp(bf_pe_obj@bayesFactor$bf))
bf_H2b_EI <- as.numeric(exp(bf_ei_obj@bayesFactor$bf))

# Frequentist t-tests + Cohen's d
t_pe     <- t.test(perc_scores, epis_scores, paired = TRUE)
t_ei     <- t.test(epis_scores, imag_scores, paired = TRUE)
d_pe     <- (mean(perc_scores) - mean(epis_scores)) / sd(perc_scores - epis_scores)
d_ei     <- (mean(epis_scores) - mean(imag_scores)) / sd(epis_scores - imag_scores)

cat(sprintf("   Perceptual > Episodic   BF10: %.4f  t(%.0f)=%.3f  d=%.3f\n",
            bf_H2b_PE, t_pe$parameter, t_pe$statistic, d_pe))
cat(sprintf("   Episodic > Imagination  BF10: %.4f  t(%.0f)=%.3f  d=%.3f\n\n",
            bf_H2b_EI, t_ei$parameter, t_ei$statistic, d_ei))


# --- H3: Convergent Validity (VVIQ-2 correlations) ---
cat("== H3: Convergent Validity (Correlations with VVIQ-2)\n")

df_sub_vviq <- df_sub %>% filter(!is.na(VVIQ2))

r_int <- NA; p_int <- NA; r_spe <- NA; p_spe <- NA

if (nrow(df_sub_vviq) >= 5) {
  bf_r1_obj    <- correlationBF(df_sub_vviq$Intensity,   df_sub_vviq$VVIQ2)
  bf_r2_obj    <- correlationBF(df_sub_vviq$Specificity, df_sub_vviq$VVIQ2)
  bf_H3_int    <- as.numeric(exp(bf_r1_obj@bayesFactor$bf))
  bf_H3_spe    <- as.numeric(exp(bf_r2_obj@bayesFactor$bf))
  cor_int_test <- cor.test(df_sub_vviq$Intensity,   df_sub_vviq$VVIQ2)
  cor_spe_test <- cor.test(df_sub_vviq$Specificity, df_sub_vviq$VVIQ2)
  r_int <- as.numeric(cor_int_test$estimate)
  p_int <- as.numeric(cor_int_test$p.value)
  r_spe <- as.numeric(cor_spe_test$estimate)
  p_spe <- as.numeric(cor_spe_test$p.value)
  cat(sprintf("   r(Intensity, VVIQ-2):   r=%.3f  BF10=%.4f\n", r_int, bf_H3_int))
  cat(sprintf("   r(Specificity, VVIQ-2): r=%.3f  BF10=%.4f\n\n", r_spe, bf_H3_spe))
} else {
  bf_H3_int <- NA
  bf_H3_spe <- NA
  cat("   Not enough VVIQ data for H3 correlations.\n\n")
}


# =====================================================================
# STEP 3: SEQUENTIAL STOPPING RULE
# =====================================================================
cat(">> SEQUENTIAL STOPPING RULE\n")

is_decisive <- function(bf) !is.na(bf) && (bf > 6 || bf < (1/6))
criteria <- list(
  H1_interaction         = bf_H1,
  H2a_specificity_ME     = bf_H2a,
  H2b_perceptual_episodic = bf_H2b_PE,
  H2b_episodic_imagination = bf_H2b_EI
)

decisive_flags  <- sapply(criteria, is_decisive)
decisive_count  <- sum(decisive_flags)
all_decisive    <- all(decisive_flags)
stop_decision   <- if (all_decisive || n_analyzed >= 150) "STOP" else "CONTINUE"

# Next milestone (every 10 participants)
milestones <- seq(60, 150, by=10)
next_milestone <- milestones[milestones > n_analyzed][1]
if (is.na(next_milestone)) next_milestone <- 150

for (nm in names(criteria)) {
  bf_val <- criteria[[nm]]
  flag   <- if (is_decisive(bf_val)) "[X]" else "[ ]"
  cat(sprintf("  %s %s: %.4f\n", flag, nm, ifelse(is.na(bf_val), 0, bf_val)))
}

cat(sprintf("\n  Decisive: %d / %d\n", decisive_count, length(criteria)))
cat(sprintf("  Decision: %s\n\n", stop_decision))


# =====================================================================
# STEP 4: VISUALIZATIONS
# =====================================================================
cat(">> Generating plots in", PLOT_DIR, "\n")

cond_labels <- c(
  perceptual_recall = "Perceptual",
  episodic_recall   = "Episodic",
  scene_imagination = "Imagination"
)

df_long_plot <- df_long %>%
  mutate(ConditionLabel = factor(recode(as.character(Condition), !!!cond_labels),
                                  levels = c("Perceptual","Episodic","Imagination")))

# Plot 1: H1 Interaction
plot_h1_data <- df_long_plot %>%
  group_by(ConditionLabel, Dimension) %>%
  summarize(mean_score = mean(Score, na.rm=TRUE), se = sd(Score, na.rm=TRUE)/sqrt(n()), .groups="drop")

p1 <- ggplot(plot_h1_data, aes(x=ConditionLabel, y=mean_score, group=Dimension, color=Dimension)) +
  geom_line(linewidth=1.2) + geom_point(size=4) +
  geom_errorbar(aes(ymin=mean_score-se, ymax=mean_score+se), width=0.1) +
  scale_color_manual(values=c("Intensity"="#1E88E5","Specificity"="#D81B60")) +
  theme_minimal(base_size=14) +
  labs(title="H1: Dissociation of Intensity & Specificity",
       y="Mean Score (± SE)", x="Memory Condition") +
  theme(legend.position="bottom")

ggsave(file.path(PLOT_DIR, "H1_Interaction.pdf"), p1, width=7, height=5)

# Plot 2: H2 Specificity Hierarchy
df_spec_plot <- df_spec %>%
  mutate(ConditionLabel = factor(recode(as.character(Condition), !!!cond_labels),
                                  levels=c("Perceptual","Episodic","Imagination")))

p2 <- ggplot(df_spec_plot, aes(x=ConditionLabel, y=Score, fill=ConditionLabel)) +
  geom_violin(alpha=0.5, trim=FALSE, adjust=1.5) +
  geom_boxplot(width=0.1, fill="white", outlier.shape=NA) +
  geom_jitter(width=0.05, alpha=0.3, size=1.5) +
  scale_fill_manual(values=c("#D81B60","#1E88E5","#FFC107")) +
  theme_minimal(base_size=14) +
  labs(title="H2: Specificity Hierarchy", y="Specificity Score", x="") +
  theme(legend.position="none")

ggsave(file.path(PLOT_DIR, "H2_Specificity_Hierarchy.pdf"), p2, width=6, height=5)

# Plot 3: H3 Convergent Validity
if (!is.na(bf_H3_int)) {
  df_h3_long <- df_sub_vviq %>%
    pivot_longer(cols=c(Intensity, Specificity), names_to="Dimension", values_to="Score")
  p3 <- ggplot(df_h3_long, aes(x=VVIQ2, y=Score, color=Dimension)) +
    geom_point(alpha=0.6, size=2) +
    geom_smooth(method="lm", alpha=0.2) +
    scale_color_manual(values=c("Intensity"="#1E88E5","Specificity"="#D81B60")) +
    theme_minimal(base_size=14) +
    labs(title="H3: Correlation with VVIQ-2") +
    facet_wrap(~Dimension) + theme(legend.position="none")
  ggsave(file.path(PLOT_DIR, "H3_Convergent_Validity.pdf"), p3, width=8, height=4)
}

cat("   Plots saved.\n")


# =====================================================================
# STEP 5: WRITE results.json
# =====================================================================

# Extract frequentist ANOVA stats safely
safe_anova_stat <- function(obj, effect, col) {
  tryCatch({
    tbl <- obj$anova_table
    as.numeric(tbl[effect, col])
  }, error = function(e) NA_real_)
}

h1_F   <- safe_anova_stat(freq_h1,  "Dimension:Condition", "F")
h1_p   <- safe_anova_stat(freq_h1,  "Dimension:Condition", "Pr(>F)")
h1_eta <- safe_anova_stat(freq_h1,  "Dimension:Condition", "ges")
h2a_F  <- safe_anova_stat(freq_h2a, "Condition", "F")
h2a_p  <- safe_anova_stat(freq_h2a, "Condition", "Pr(>F)")
h2a_eta<- safe_anova_stat(freq_h2a, "Condition", "ges")

# Interaction means for chart
cond_labels_map <- c(perceptual_recall="Perceptual", episodic_recall="Episodic", scene_imagination="Imagination")
interaction_means <- df_long %>%
  mutate(CondLabel = recode(as.character(Condition), !!!cond_labels_map)) %>%
  group_by(CondLabel, Dimension) %>%
  summarize(mean=mean(Score,na.rm=TRUE), se=sd(Score,na.rm=TRUE)/sqrt(n()),
            sd=sd(Score,na.rm=TRUE), n=n(), .groups="drop")

# Specificity raw values per condition for violin
spec_vals <- df_spec %>%
  mutate(CondLabel = recode(as.character(Condition), !!!cond_labels_map)) %>%
  group_by(CondLabel) %>%
  summarize(values = list(Score), .groups = "drop")

results <- list(
  timestamp     = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz="UTC"),
  n_raw         = n_raw,
  n_analyzed    = n_analyzed,
  bfs = list(
    H1_interaction              = bf_H1,
    H2a_specificity_main        = bf_H2a,
    H2b_perceptual_vs_episodic  = bf_H2b_PE,
    H2b_episodic_vs_imagination = bf_H2b_EI,
    H3_intensity_vviq           = bf_H3_int,
    H3_specificity_vviq         = bf_H3_spe
  ),
  stats = list(
    H1  = list(F=h1_F,  p=h1_p,  eta_sq=h1_eta),
    H2a = list(F=h2a_F, p=h2a_p, eta_sq=h2a_eta),
    H2b_PE = list(t=as.numeric(t_pe$statistic), df=as.numeric(t_pe$parameter),
                  p=as.numeric(t_pe$p.value), d=d_pe),
    H2b_EI = list(t=as.numeric(t_ei$statistic), df=as.numeric(t_ei$parameter),
                  p=as.numeric(t_ei$p.value), d=d_ei),
    H3_int = list(r=r_int, p=p_int, n=nrow(df_sub_vviq)),
    H3_spe = list(r=r_spe, p=p_spe, n=nrow(df_sub_vviq))
  ),
  chart_data = list(
    interaction_means  = interaction_means,
    specificity_by_cond = setNames(
      lapply(spec_vals$values, function(v) round(v, 4)),
      spec_vals$CondLabel
    ),
    vviq_values = if (nrow(df_sub_vviq) > 0) round(df_sub_vviq$VVIQ2, 2) else list()
  ),
  stopping = list(
    decision       = stop_decision,
    decisive_count = decisive_count,
    total_criteria = length(criteria),
    all_decisive   = all_decisive
  ),
  next_milestone = next_milestone
)

results_path <- file.path(DATA_DIR, "results.json")
write_json(results, results_path, auto_unbox=TRUE, digits=4, null="null")
cat(">> Results written to:", results_path, "\n")
cat("=========================================================\n")
