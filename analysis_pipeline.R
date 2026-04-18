# =====================================================================
# ViVIM Pre-Registered Analysis Pipeline (R Translation + Visualization)
# =====================================================================
# This script precisely mirrors the Python analysis_pipeline.py logic,
# but utilizes R's rich statistical ecosystem and ggplot2 for 
# publication-ready data visualizations.

# --- 1. Dependencies Setup ---
# Automatically install pacman if missing, then load required libraries
if (!require("pacman")) install.packages("pacman")
pacman::p_load(
  tidyverse,    # Data manipulation and ggplot2
  afex,         # Frequentist RM-ANOVAs
  BayesFactor,  # Bayesian analyses
  psych,        # Intra-Class Correlations (ICC)
  TOSTER,       # Equivalence Testing
  lme4,         # Linear Mixed Models
  lmerTest,     # p-values for LMMs
  cocor,        # Steiger's Z tests
  patchwork     # Plot combining
)

# --- 2. Configuration ---
SCENARIO <- "MESSY"  # Switch to 'IDEAL' to test a perfectly clean cascade
N_PARTICIPANTS <- 60
TRIALS_PER_CONDITION <- 4
CONDITIONS <- c('Perceptual', 'Episodic', 'Imagination')
PLOT_DIR <- "plots"
if(!dir.exists(PLOT_DIR)) dir.create(PLOT_DIR)

set.seed(42) # For reproducibility

# =====================================================================
# STEP 1: DATA SIMULATION (Matches Python Pilot Constraints)
# =====================================================================
cat(">> STEP 1: Simulating trial-level data for", N_PARTICIPANTS, "participants...\n")

df_trials_list <- list()

for(p in 1:N_PARTICIPANTS) {
  # Baseline traits
  vviq2 <- round(runif(1, 32, 160))
  # Map VVIQ (32-160) to a baseline ability (150 to 250)
  baseline_ability <- 150 + ((vviq2 - 32) / (160 - 32)) * 100
  
  for(cond in CONDITIONS) {
    for(t in 1:TRIALS_PER_CONDITION) {
      
      # Intensity (H1: Stable)
      int_drop <- 0 # Pilot intensity was remarkably flat across conditions!
      intensity_noise <- ifelse(SCENARIO == 'IDEAL', 20, 25)
      intensity <- rnorm(1, mean = baseline_ability - int_drop, sd = intensity_noise)
      
      # Specificity (H2: Decays)
      if(cond == 'Perceptual') {
        spec_drop <- 0
      } else if(cond == 'Episodic') {
        spec_drop <- ifelse(SCENARIO == 'IDEAL', rnorm(1, 30, 15), rnorm(1, 27, 25))
      } else { # Imagination
        spec_drop <- ifelse(SCENARIO == 'IDEAL', rnorm(1, 60, 20), rnorm(1, 42, 30))
      }
      spec_noise <- ifelse(SCENARIO == 'IDEAL', 20, 35)
      specificity <- rnorm(1, mean = baseline_ability - spec_drop, sd = spec_noise)
      
      # Constrain output (0 to 300)
      intensity <- min(max(intensity, 0), 300)
      specificity <- min(max(specificity, 0), 300)
      
      df_trials_list[[length(df_trials_list) + 1]] <- data.frame(
        Participant = as.character(p),
        Condition = factor(cond, levels = CONDITIONS),
        Trial = t,
        Intensity = intensity,
        Specificity = specificity,
        VVIQ2 = vviq2
      )
    }
  }
}

df_trials <- bind_rows(df_trials_list) %>%
  mutate(Participant = as.factor(Participant))

# STEP 2: Aggregate to Participant Level
df_agg <- df_trials %>%
  group_by(Participant, Condition) %>%
  summarize(
    Intensity = mean(Intensity),
    Specificity = mean(Specificity),
    VVIQ2 = first(VVIQ2),
    .groups = 'drop'
  )

# Reshape data into 'long' format for Repeated Measures ANOVA
df_long <- df_agg %>%
  pivot_longer(
    cols = c(Intensity, Specificity),
    names_to = "Dimension",
    values_to = "Score"
  ) %>%
  mutate(Dimension = factor(Dimension, levels=c("Intensity", "Specificity")))

cat("Simulation complete. Proceeding to statistical analysis...\n")
cat("----------------------------------------------------------\n")


# =====================================================================
# STEP 3: HYPOTHESIS TESTING
# =====================================================================

# ---------------------------------------------------------------------
cat("== TESTING H1: Dissociation (2x3 Repeated Measures ANOVA)\n\n")

# Frequentist
freq_h1 <- afex::aov_ez(id = "Participant", dv = "Score", 
                        within = c("Dimension", "Condition"), data = df_long)
print(summary(freq_h1))

# Bayesian
bf_main <- anovaBF(Score ~ Dimension * Condition + Participant, data = df_long, 
                   whichRandom = "Participant", progress = FALSE)
bf_interaction_only <- bf_main[4] / bf_main[3] 
bf_h1_interaction <- exp(bf_interaction_only@bayesFactor$bf)
cat("\n-> Bayes Factor for interaction (inclusion):", round(bf_h1_interaction, 2), "\n")


# ---------------------------------------------------------------------
cat("\n----------------------------------------------------------\n")
cat("== TESTING H2a: Vividness Hierarchy Main Effect (on Specificity)\n")

df_spec <- df_long %>% filter(Dimension == "Specificity")
freq_h2a <- afex::aov_ez(id = "Participant", dv = "Score", 
                         within = "Condition", data = df_spec)
print(summary(freq_h2a))

bf_h2a <- anovaBF(Score ~ Condition + Participant, data=df_spec, 
                  whichRandom="Participant", progress=FALSE)
bf_h2a_val <- exp(bf_h2a@bayesFactor$bf)
cat("-> Bayes Factor for Specificity Main Effect:", round(bf_h2a_val, 2), "\n")


# ---------------------------------------------------------------------
cat("\n== TESTING H2b: Directional Contrasts\n")

perc_scores <- df_spec %>% filter(Condition == "Perceptual") %>% pull(Score)
epis_scores <- df_spec %>% filter(Condition == "Episodic") %>% pull(Score)
imag_scores <- df_spec %>% filter(Condition == "Imagination") %>% pull(Score)

bf_pe <- ttestBF(perc_scores, epis_scores, paired = TRUE)
bf_ei <- ttestBF(epis_scores, imag_scores, paired = TRUE)

cat("   Perceptual > Episodic (BF10):", round(exp(bf_pe@bayesFactor$bf), 2), "\n")
cat("   Episodic > Imagination (BF10):", round(exp(bf_ei@bayesFactor$bf), 2), "\n")


# ---------------------------------------------------------------------
cat("\n----------------------------------------------------------\n")
cat("== TESTING H3: Convergent Validity (Correlations with VVIQ-2)\n")

df_sub <- df_agg %>% 
  group_by(Participant) %>% 
  summarize(Intensity = mean(Intensity), Specificity = mean(Specificity), VVIQ2 = first(VVIQ2))

cor_int <- cor.test(df_sub$Intensity, df_sub$VVIQ2)
cor_spe <- cor.test(df_sub$Specificity, df_sub$VVIQ2)

bf_r1 <- correlationBF(df_sub$Intensity, df_sub$VVIQ2)
bf_r2 <- correlationBF(df_sub$Specificity, df_sub$VVIQ2)

cat(sprintf("   r1 (Intensity-VVIQ): r = %.3f, BF10 = %.2f\n", cor_int$estimate, exp(bf_r1@bayesFactor$bf)))
cat(sprintf("   r2 (Specificity-VVIQ): r = %.3f, BF10 = %.2f\n", cor_spe$estimate, exp(bf_r2@bayesFactor$bf)))

# Steiger's Z
r1_val <- cor_int$estimate
r2_val <- cor_spe$estimate
r.12 <- cor(df_sub$Intensity, df_sub$Specificity)
steiger <- cocor.dep.groups.overlap(r.jk=r1_val, r.jh=r2_val, r.kh=r.12, n=N_PARTICIPANTS)
cat("   Steiger's Z Test Results:\n")
print(steiger)


# =====================================================================
# STEP 4: VISUALIZATIONS (ggplot2)
# =====================================================================
cat("\n>> GENERATING PUBLICATION PLOTS in ./plots/ \n")

bg_colors <- c("#D81B60", "#1E88E5", "#FFC107") # Accessibility-friendly palette

# --- Plot 1: Interaction Line Plot (H1) ---
plot_h1_data <- df_long %>%
  group_by(Condition, Dimension) %>%
  summarize(mean_score = mean(Score), se = sd(Score)/sqrt(n()), .groups = 'drop')

p1 <- ggplot(plot_h1_data, aes(x = Condition, y = mean_score, group = Dimension, color = Dimension)) +
  geom_line(linewidth = 1.2) +
  geom_point(size = 4) +
  geom_errorbar(aes(ymin = mean_score - se, ymax = mean_score + se), width = 0.1) +
  scale_color_manual(values = c("Intensity" = "#1E88E5", "Specificity" = "#D81B60")) +
  theme_minimal(base_size = 14) +
  labs(title = "H1: Dissociation of Intensity & Specificity",
       y = "Mean Score (± SE)", x = "Memory Condition") +
  theme(legend.position = "bottom")

ggsave(file.path(PLOT_DIR, "H1_Interaction_Plot.pdf"), p1, width = 7, height = 5)


# --- Plot 2: Hierarchy Raincloud Plot (H2) ---
# Simple Raincloud using base ggplot geoms to prevent missing dependency errors
p2 <- ggplot(df_spec, aes(x = Condition, y = Score, fill = Condition)) +
  geom_violin(alpha = 0.5, trim = FALSE, adjust = 1.5) +
  geom_boxplot(width = 0.1, fill = "white", outlier.shape = NA) +
  geom_jitter(width = 0.05, alpha = 0.3, size = 1.5) +
  scale_fill_manual(values = bg_colors) +
  theme_minimal(base_size = 14) +
  labs(title = "H2: Specificity Decay Across Conditions",
       y = "Specificity Score", x = "") +
  theme(legend.position = "none")

ggsave(file.path(PLOT_DIR, "H2_Hierarchy_Violin.pdf"), p2, width = 6, height = 5)


# --- Plot 3: Convergent Validity Scatters (H3) ---
df_h3_long <- df_sub %>%
  pivot_longer(cols = c(Intensity, Specificity), names_to = "Dimension", values_to = "Score")

p3 <- ggplot(df_h3_long, aes(x = VVIQ2, y = Score, color = Dimension)) +
  geom_point(alpha = 0.6, size = 2) +
  geom_smooth(method = "lm", alpha = 0.2) +
  scale_color_manual(values = c("Intensity" = "#1E88E5", "Specificity" = "#D81B60")) +
  theme_minimal(base_size = 14) +
  labs(title = "H3: Correlation with VVIQ-2") +
  facet_wrap(~Dimension) + 
  theme(legend.position = "none")

ggsave(file.path(PLOT_DIR, "H3_Convergent_Validity.pdf"), p3, width = 8, height = 4)

cat("   [OK] Generated Ploted and saved to:", PLOT_DIR, "\n")


# =====================================================================
# STEP 5: ROBUSTNESS CHECKS & SEQUENTIAL STOPPING
# =====================================================================
cat("\n>> ROBUSTNESS CHECKS\n")

# ICC
df_perc_spec <- df_trials %>% filter(Condition == "Perceptual") %>% select(Participant, Trial, Specificity)
icc_val <- ICC(df_perc_spec %>% pivot_wider(names_from = Trial, values_from = Specificity) %>% select(-Participant))
cat("  - ICC(3,k):", round(icc_val$results$ICC[6], 2), "\n")

# TOST
cat("  - Equivalence TOST testing bounded p-value...\n")
tost_res <- TOSTER::tsum_TOST(m1 = mean(perc_scores), sd1 = sd(perc_scores), n1 = length(perc_scores),
                              m2 = mean(imag_scores), sd2 = sd(imag_scores), n2 = length(imag_scores),
                              eqb = 0.3)
# LMM
cat("  - Linear Mixed Effects Model (Warning is expected due to simulated variance!)\n")

df_trials_long <- df_trials %>%
  pivot_longer(cols = c(Intensity, Specificity), names_to = "Dimension", values_to = "Score") %>%
  mutate(Dimension = factor(Dimension, levels=c("Intensity", "Specificity")))

suppressWarnings({
  lmm_model <- lmerTest::lmer(Score ~ Dimension * Condition + (1 | Participant), data = df_trials_long)
})
print(summary(lmm_model)$coef)

cat("\n----------------------------------------------------------\n")
cat(">> SEQUENTIAL SAMPLING 'ALL OR MAX' RULE LOGIC\n")
check_bf <- function(val) { if(val > 6 || val < (1/6)) "[X]" else "[ ]" }

cat(sprintf("  %s BF_incl (Interaction H1): %.2f\n", check_bf(bf_h1_interaction), bf_h1_interaction))
cat(sprintf("  %s BF_incl (Specificity M.E. H2): %.2f\n", check_bf(bf_h2a_val), bf_h2a_val))
cat(sprintf("  %s BF_r1 (Intensity ~ VVIQ): %.2f\n", check_bf(exp(bf_r1@bayesFactor$bf)), exp(bf_r1@bayesFactor$bf)))
cat(sprintf("  %s BF_r2 (Specificity ~ VVIQ): %.2f\n", check_bf(exp(bf_r2@bayesFactor$bf)), exp(bf_r2@bayesFactor$bf)))
cat("=========================================================\n")
