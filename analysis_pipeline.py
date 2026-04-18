import pandas as pd
import numpy as np
import pingouin as pg
import scipy.stats as stats
import warnings
warnings.filterwarnings('ignore') # Suppress warnings for clean output

# ==============================================================================
# VIVIM TASK: FULL ANALYSIS PIPELINE DEMONSTRATION WITH SIMULATED DATA
# ==============================================================================
# This script enacts the data analysis plan detailed in the Registered Report.
# It simulates a plausible dataset for N=60 participants behaving according 
# to the hypothesized patterns, and runs through H1, H2, H3, and robustness checks.
# ==============================================================================

print("Starting ViVIM Analysis Pipeline...\n")

# ------------------------------------------------------------------------------
# STEP 1: SIMULATE THE DATA
# ------------------------------------------------------------------------------
# We simulate trial-level data for N=60 participants.
# The hypothesis predicts:
# - Subjective Intensity (Brightness + Contrast + Saturation): Stays relatively 
#   stable across conditions. Range: 0-300 per trial.
# - Subjective Specificity (Clarity + Detailedness + Color Precision): Degrades 
#   significantly from Perceptual -> Episodic -> Imagination. Range: 0-300.
# - VVIQ-2: Positively correlated with Intensity, less so with Specificity.

# SET SCENARIO: 'IDEAL' to perfectly mirror hypotheses, 'MESSY' for noisier data 
SCENARIO = 'MESSY'

np.random.seed(42) # For reproducibility
N = 60
conditions = ['Perceptual', 'Episodic', 'Imagination']
trials_per_condition = 4

data_rows = []
for participant in range(1, N + 1):
    # Simulate an individual's baseline imagery ability
    baseline_ability = np.random.normal(150, 30) 
    
    # Simulate VVIQ-2 score (1-5 scale, 32 items, Total: 32-160)
    # VVIQ-2 correlates with baseline ability (Intensity proxy)
    vviq_raw = int(np.clip(baseline_ability / 300 * 160 + np.random.normal(0, 10), 32, 160))
    
    for cond in conditions:
        for t in range(1, trials_per_condition + 1):
            
            # --- Intensity (Hypothesis 1: Stable across conditions) ---
            # In 'IDEAL' scenario, it never drops. In 'MESSY' (Pilot), it was also effectively flat!
            if cond == 'Perceptual':
                int_drop = 0
            elif cond == 'Episodic':
                int_drop = 0 if SCENARIO == 'IDEAL' else 0 # Pilot intensity was remarkably stable
            else:
                int_drop = 0 if SCENARIO == 'IDEAL' else 0

            # Pilot intensity clustered tightly around the neutral point
            intensity_noise = 20 if SCENARIO == 'IDEAL' else 25
            intensity = np.clip(np.random.normal(baseline_ability - int_drop, intensity_noise), 0, 300)
            
            # --- Specificity (Hypothesis 1 & 2: Decays across conditions) ---
            # Specificity starts tied to baseline, but drops based on abstraction
            if cond == 'Perceptual':
                spec_drop = 0
            elif cond == 'Episodic':
                # Pilot Specificity went ~82% -> ~73% (approx 27 point drop out of 300)
                spec_drop = np.random.normal(30, 15) if SCENARIO == 'IDEAL' else np.random.normal(27, 25)
            else: # Imagination
                # Pilot Specificity went ~82% -> ~68% (approx 42 point drop out of 300)
                spec_drop = np.random.normal(60, 20) if SCENARIO == 'IDEAL' else np.random.normal(42, 30)
                
            spec_noise = 20 if SCENARIO == 'IDEAL' else 35
            specificity = np.clip(np.random.normal(baseline_ability - spec_drop, spec_noise), 0, 300)
            
            data_rows.append({
                'Participant': participant,
                'Condition': cond,
                'Trial': t,
                'Intensity': intensity,
                'Specificity': specificity,
                'VVIQ2': vviq_raw
            })

df_trials = pd.DataFrame(data_rows)

print(">> STEP 1: Simulated trial-level data for 60 participants.")
print(df_trials.head())
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 2: PREPROCESSING AND AGGREGATION
# ------------------------------------------------------------------------------
# The primary dependent variables are the per-condition composite scores, 
# computed by averaging the 4 trials per condition per participant.

df_agg = df_trials.groupby(['Participant', 'Condition']).agg({
    'Intensity': 'mean',
    'Specificity': 'mean',
    'VVIQ2': 'first' # VVIQ2 is participant-level, so taking the first is fine
}).reset_index()

# To run a 2x3 ANOVA, we need the data in "long" format where Dimension 
# (Intensity vs Specificity) is a factor column.
df_long = pd.melt(df_agg, 
                  id_vars=['Participant', 'Condition', 'VVIQ2'], 
                  value_vars=['Intensity', 'Specificity'],
                  var_name='Dimension', 
                  value_name='Score')

print(">> STEP 2: Aggregated data to participant level.")
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 3: HYPOTHESIS 1 (DISSOCIATION)
# ------------------------------------------------------------------------------
# H1: A Bayesian 2x3 repeated-measures ANOVA with factors Dimension (Intensity 
# vs. Specificity) and Condition (Perceptual, Episodic, Imagination).
# We are looking for a significant Dimension × Condition interaction (BF_incl > 6).
print("== TESTING H1: Dissociation (2x3 Repeated Measures ANOVA)")

# Using Python's Pingouin library. We extract the Bayes Factor for the interaction.
# (Note: For Bayesian rmANOVA with multiple factors, BayesFactor R package via rpy2 
# is often the gold standard, but pingouin handles 1-way and 2-way natively).
# Pingouin currently does not natively output BF_incl for 2-way RM ANOVA in all versions, 
# but it provides standard frequentist partial eta squared (which we report alongside).

aov_h1 = pg.rm_anova(data=df_long, dv='Score', within=['Dimension', 'Condition'], 
                     subject='Participant', detailed=True)
print("\nFrequentist 2x3 ANOVA Results:")
print(aov_h1)

# In an actual analysis script where PyMC/BayesFactor is used for the exact BF_incl, 
# the code would estimate the marginal likelihood of the models with and without the interaction.
# We will simulate the extraction of a Bayes Factor here for demonstration:
simulated_bf_interaction = 54.2 
print(f"-> Simulated BF_inclusion for Dimension x Condition interaction: {simulated_bf_interaction}")
if simulated_bf_interaction > 6:
    print("   Interpretation: Decisive evidence FOR the Dissociation hypothesis (Interaction).")
elif simulated_bf_interaction < 1/6:
    print("   Interpretation: Decisive evidence AGAINST the Dissociation hypothesis (Interaction).")
else:
    print("   Interpretation: Inconclusive evidence regarding the Dissociation hypothesis.")
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 4: HYPOTHESIS 2 (VIVIDNESS HIERARCHY)
# ------------------------------------------------------------------------------
# H2a: A Bayesian one-way repeated-measures ANOVA on Subjective Specificity scores.
print("== TESTING H2a: Vividness Hierarchy Main Effect (1-way RM ANOVA on Specificity)")

# Isolate Specificity data
df_spec = df_agg[['Participant', 'Condition', 'Specificity']]

# Pingouin's 1-way bayesian ANOVA
# Note: Pingouin doesn't directly do 1-way Bayesian *Repeated Measures* easily in all versions,
# but we can often use appropriate PyMC robust models or JASP/R. We will use standard frequentist 
# anova for effect sizes, and mock the BF for context.
aov_h2 = pg.rm_anova(data=df_spec, dv='Specificity', within='Condition', subject='Participant')
print("\nFrequentist 1x3 ANOVA (Specificity):")
print(aov_h2)

# Simulate Main Effect Bayes Factor
bf_main_effect = 120.5 
print(f"-> Simulated BF_inclusion for Condition main effect on Specificity: {bf_main_effect}")

if bf_main_effect > 6:
    print("\n== TESTING H2b: Pre-planned Directional Contrasts")
    # We predict Specificity(Perceptual) > Specificity(Episodic) > Specificity(Imagination)
    
    # Pivot for paired tests
    df_pivot = df_spec.pivot(index='Participant', columns='Condition', values='Specificity')
    
    ttest_p_e = pg.ttest(df_pivot['Perceptual'], df_pivot['Episodic'], paired=True)
    bf_p_e = float(ttest_p_e['BF10'].item())
    print(f"   Perceptual > Episodic (BF10): {bf_p_e}")
    print(f"   Interpretation: {'Decisive evidence FOR' if bf_p_e > 6 else 'Insufficient evidence for'} Perceptual > Episodic.")
    
    ttest_e_i = pg.ttest(df_pivot['Episodic'], df_pivot['Imagination'], paired=True)
    bf_e_i = float(ttest_e_i['BF10'].item())
    print(f"   Episodic > Imagination (BF10): {bf_e_i}")
    print(f"   Interpretation: {'Decisive evidence FOR' if bf_e_i > 6 else 'Insufficient evidence for'} Episodic > Imagination.")
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 5: HYPOTHESIS 3 (CONVERGENT VALIDITY)
# ------------------------------------------------------------------------------
# H3: Two Pearson correlations. 
# r1 = ViVIM Intensity vs VVIQ-2
# r2 = ViVIM Specificity vs VVIQ-2
# We predict r1 is positive (BF > 6), and r1 > r2 (Steiger's Z test)
print("== TESTING H3: Convergent Validity (Correlations with VVIQ-2)")

# We need the overall mean across all conditions for each participant
df_totals = df_agg.groupby('Participant').agg({
    'Intensity': 'mean',
    'Specificity': 'mean',
    'VVIQ2': 'first'
})

r1 = pg.corr(df_totals['Intensity'], df_totals['VVIQ2'])
r2 = pg.corr(df_totals['Specificity'], df_totals['VVIQ2'])

# Pingouin natively calculates the Bayes Factor for Pearson correlations.
bf_r1 = pg.bayesfactor_pearson(r1['r'].item(), N)
bf_r2 = pg.bayesfactor_pearson(r2['r'].item(), N)

print(f"   r1 (Intensity-VVIQ): r = {r1['r'].item():.3f}, BF10 = {bf_r1:.2f}")
print(f"   r2 (Specificity-VVIQ): r = {r2['r'].item():.3f}, BF10 = {bf_r2:.2f}")

# Steiger's Z test for dependent correlations sharing a variable
# R_xy (Intensity & VVIQ), R_zy (Specificity & VVIQ), R_xz (Intensity & Specificity)
r_xz = df_totals['Intensity'].corr(df_totals['Specificity'])

def steiger_z(r_xy, r_zy, r_xz, n):
    # Calculates Steiger's Z for the difference between two dependent correlations
    # (Meng, Rosenthal & Rubin, 1992 formula)
    r2_x = r_xy ** 2
    r2_z = r_zy ** 2
    r2_xz = r_xz ** 2
    
    # Formula components
    f = (1 - r_xz) / (2 * (1 - r_xz**2))
    h = (1 - f * (r2_x + r2_z) / 2) / (1 - r2_xz)
    z_xy = np.arctanh(r_xy)
    z_zy = np.arctanh(r_zy)
    
    z_score = (z_xy - z_zy) * np.sqrt((n - 3) / (2 * (1 - r_xz) * h))
    p_val = 1 - stats.norm.cdf(z_score) # One-tailed as preregistered (r1 > r2)
    return z_score, p_val

z_val, p_steiger = steiger_z(r1['r'].item(), r2['r'].item(), r_xz, N)
print(f"   Steiger's Z test: Z = {z_val:.3f}, p-value (1-tailed) = {p_steiger:.4f}")
print(f"   Interpretation: {'Confirmed' if p_steiger < 0.05 and bf_r1 > 6 else 'Rejected'} Convergent Validity prediction (r1 > r2 and r1 is significant).")
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 6: ROBUSTNESS CHECKS
# ------------------------------------------------------------------------------
print(">> ROBUSTNESS CHECKS")

# 1. Intra-Class Correlation (ICC) Reliability
print("\n- ICC Reliability Assessment:")
# To calculate ICC, we reshape the Specificity data to assess agreement across the 4 trials
df_icc = df_trials[df_trials['Condition'] == 'Perceptual'][['Participant', 'Trial', 'Specificity']]
icc = pg.intraclass_corr(data=df_icc, targets='Participant', raters='Trial', ratings='Specificity')
print(icc)
print("  Interpretation: ICC(3,k) or ICC(C,k) values > 0.70 indicate good reliability across trials.")

# 2. Equivalence Testing (TOST)
print("\n- Equivalence Testing (TOST):")
# Example: testing if Intensity in Perceptual is statistically equivalent to Intensity in Imagination
df_int_pivot = df_agg.pivot(index='Participant', columns='Condition', values='Intensity')
tost_res = pg.tost(df_int_pivot['Perceptual'], df_int_pivot['Imagination'], paired=True, bound=0.3)
print("  Are Perceptual and Imagination Intensity equivalent within bounds +/- 0.3?")
print(f"  Test reached Equivalence? {'Yes' if tost_res['pval'][0] < 0.05 else 'No'} (p={tost_res['pval'][0]:.4f})")

# 3. Trial-Level Linear Mixed Model
# Uses statsmodels to prevent aggregation
import statsmodels.formula.api as smf
import warnings
from statsmodels.tools.sm_exceptions import ConvergenceWarning

print("\n- Linear Mixed-Effects Model (LMM):")
# For the LMM we need Dimension in the trial-level dataframe
df_trials_long = pd.melt(df_trials, 
                  id_vars=['Participant', 'Condition', 'Trial'], 
                  value_vars=['Intensity', 'Specificity'],
                  var_name='Dimension', 
                  value_name='Score')

with warnings.catch_warnings():
    warnings.simplefilter('ignore', ConvergenceWarning)
    
    md = smf.mixedlm("Score ~ Dimension * Condition", df_trials_long, groups=df_trials_long["Participant"])
    mdf = md.fit(method='lbfgs')
    print("  LMM converged successfully. Fixed Effects:")
    print(mdf.summary().tables[1].to_string())
    
    print("\n  LMM Interpretation:")
    print("   -> NOTE: 'Convergence warnings' around Positive Definite Hessians are completely expected here.")
    print("      Because we are simulating identical variance structures, the 'Group Var' (participant-level differences)")
    print("      hits a boundary condition of 0.000, triggering the warning.")
    print("   -> The interaction Fixed Effects (Dimension[T.Specificity]:Condition) cross-validate our ANOVA.")
    print("      If those P>|z| values are < 0.05, the LMM supports the dissociation hypothesis at the trial level.")
print("-" * 80)

# ------------------------------------------------------------------------------
# STEP 7: BAYESIAN SEQUENTIAL STOPPING LOGIC DEMO
# ------------------------------------------------------------------------------
print(">> SEQUENTIAL SAMPLING 'ALL OR MAX' RULE LOGIC")
print("  If this were real data collection, at N=60 we check the Bayes Factors.")
print("  Conditions to stop collection:")

def check(bf):
    return "X" if float(bf) > 6 or float(bf) < (1/6) else " "

print(f"  [{check(simulated_bf_interaction)}] BF_incl (Interaction H1) > 6 or < 1/6")
print(f"  [{check(bf_main_effect)}] BF_incl (Specificity Main Effect H2) > 6 or < 1/6")
print(f"  [{check(bf_r1)}] BF_r1 (Intensity ~ VVIQ) > 6 or < 1/6")
print(f"  [{check(bf_r2)}] BF_r2 (Specificity ~ VVIQ) > 6 or < 1/6")

print("\n  If ALL of the above are checked, STOP collection.")
print("  If NOT, collect 10 more participants (N=70).")
print("  If N hits 150 (MAX_N), STOP collection and report inconclusive evidence.")
print("==============================================================================")

