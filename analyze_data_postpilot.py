import pandas as pd
from scipy.stats import zscore, pearsonr, ttest_rel
from itertools import combinations
pd.options.display.float_format = '{:,.2f}'.format

# --- Configuration ---
GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1DmUF3NcYdlHPqYfa4kIMSLx5XTkdNDA_Qsz_fsGOawI/export?format=csv"

INTENSITY_PARAMS = ['brightness', 'contrast', 'saturation']
SPECIFICITY_PARAMS = ['clarity', 'detailedness', 'precision']

# Renamed for clarity: contains neutral points (for intensity) and ground truth (for specificity)
REFERENCE_LEVELS = {
    'brightness': 11,
    'contrast': 11,
    'saturation': 15,
    'clarity': 21,
    'detailedness': 21,
    'precision': 21
}
# --- End Configuration ---


def analyze_vim_data(url):
    print("--- Starting Full Data Analysis ---")

    # 1. Load Data
    try:
        df = pd.read_csv(url, engine='python')
        print(f"Successfully loaded data. Found {len(df)} rows.")
    except Exception as e:
        print(f"ERROR: Could not load data. Details: {e}")
        return

    # --- Section A: VIM Analysis ---
    # 2. Preprocessing
    df['trial_id'] = df['trial_id'].astype(str)
    df_vim = df[df['trial_id'].str.startswith('main_', na=False)].copy()
    num_subjects = df_vim['sessionID'].nunique()
    print(f"\nFound data for {num_subjects} unique participants.")

    df_vim['selected_level'] = pd.to_numeric(df_vim['selected_level'], errors='coerce')
    df_clean = df_vim.dropna(subset=['selected_level']).copy()
    df_clean = df_clean[df_clean['parameter'] != 'attention_check']

    # --- Section A2: Response Distribution Analysis ---
    print("\n" + "="*50)
    print("--- Response Distribution Analysis ---")
    print("Frequency of each level (1-21) selected for each parameter.")
    print("This helps check for floor/ceiling effects and unused scale regions.\n")

    # Get a list of all unique parameters that were actually rated
    all_params_rated = df_clean['parameter'].unique()

    for param in all_params_rated:
        print(f"--- Distribution for: {param} ---")
        
        # Filter the DataFrame for the current parameter
        param_data = df_clean[df_clean['parameter'] == param]
        
        # Get the value counts for the 'selected_level' column
        # .value_counts() automatically counts occurrences of each unique value
        # .sort_index() ensures the output is sorted by level (1, 2, 3...)
        distribution = param_data['selected_level'].value_counts().sort_index()
        
        # Print the distribution in a readable format
        for level, count in distribution.items():
            # Create a simple bar for visualization
            bar = '#' * count
            print(f"  Level {int(level):>2}: {count:<3} | {bar}")
        print("\n")

    print("="*50 + "\n")
    
    # --- 3. TRANSFORM RAW SCORES INTO THEORETICALLY MEANINGFUL SCORES ---
    
    # Create new columns for our transformed scores
    df_clean['intensity_deviation'] = pd.NA
    df_clean['specificity_fidelity'] = pd.NA

    # --- Calculate Intensity Deviation Scores ---
    for param in INTENSITY_PARAMS:
        is_param = (df_clean['parameter'] == param)
        neutral_point = REFERENCE_LEVELS[param]
        df_clean.loc[is_param, 'intensity_deviation'] = df_clean.loc[is_param, 'selected_level'] - neutral_point

    # --- Calculate Specificity Fidelity Scores (0-100 scale) ---
    # First, handle blurriness reverse-scoring directly into a temporary column
    #df_clean['sharpness'] = df_clean.loc[df_clean['parameter'] == 'blurriness', 'selected_level'].apply(lambda x: 22 - x)

    # Now calculate fidelity for all three specificity params
    df_clean.loc[df_clean['parameter'] == 'detailedness', 'specificity_fidelity'] = (df_clean['selected_level'] - 1) / 20 * 100
    df_clean.loc[df_clean['parameter'] == 'precision', 'specificity_fidelity'] = (df_clean['selected_level'] - 1) / 20 * 100
    df_clean.loc[df_clean['parameter'] == 'clarity', 'specificity_fidelity'] = (df_clean['sharpness'] - 1) / 20 * 100

    # --- 4. Calculate Composite Scores (from the new transformed scores) ---
    df_intensity = df_clean.dropna(subset=['intensity_deviation'])
    df_specificity = df_clean.dropna(subset=['specificity_fidelity'])

    # Aggregate by participant and condition
    intensity_summary = df_intensity.groupby(['sessionID', 'condition'])['intensity_deviation'].mean().reset_index()
    specificity_summary = df_specificity.groupby(['sessionID', 'condition'])['specificity_fidelity'].mean().reset_index()
    
    # Merge them into one summary dataframe per participant
    participant_summary = pd.merge(intensity_summary, specificity_summary, on=['sessionID', 'condition'], how='outer')
    participant_summary = participant_summary.rename(columns={'intensity_deviation': 'Intensity', 'specificity_fidelity': 'Specificity'})

    # --- THIS IS THE FIX ---
    # Explicitly convert our new composite score columns to a numeric type.
    # errors='coerce' will turn any problematic values into NaN.
    participant_summary['Intensity'] = pd.to_numeric(participant_summary['Intensity'], errors='coerce')
    participant_summary['Specificity'] = pd.to_numeric(participant_summary['Specificity'], errors='coerce')

    # --- 5. Generate Summary Tables ---

    print("\n--- Individual Participant Raw Score Summary ---")

    # First, score the VVIQ if it exists, so we can merge it.
    df_vviq_raw = df[df['trial_id'] == 'VVIQ'].copy()
    vviq_scores_raw = pd.DataFrame() # Create an empty DF to handle case of no VVIQ data

    if not df_vviq_raw.empty:
        vviq_cols = [f'vviq_{i}' for i in range(1, 33)]
        for col in vviq_cols:
            if col not in df_vviq_raw.columns: df_vviq_raw[col] = pd.NA
        df_vviq_raw[vviq_cols] = df_vviq_raw[vviq_cols].apply(pd.to_numeric, errors='coerce')
        df_vviq_raw['vviq_total_score'] = df_vviq_raw[vviq_cols].sum(axis=1)
        vviq_scores_raw = df_vviq_raw[['sessionID', 'vviq_total_score']].dropna()

    # Now, create the subject-level raw score table for VIM
    # df_clean_subj = df_clean.copy()
    # is_blurriness_subj = (df_clean_subj['parameter'] == 'blurriness')
    # df_clean_subj.loc[is_blurriness_subj, 'selected_level'] = 22 - df_clean_subj.loc[is_blurriness_subj, 'selected_level']

    subject_raw_summary = df_clean.pivot_table(
        index='sessionID',
        columns='parameter',
        values='selected_level',
        aggfunc='mean'
    )

    # Merge with VVIQ scores if they exist
    if not vviq_scores_raw.empty:
        subject_raw_summary = pd.merge(subject_raw_summary, vviq_scores_raw, on='sessionID', how='left')

    # Define the final column order
    param_order = INTENSITY_PARAMS + SPECIFICITY_PARAMS
    final_cols = param_order + (['vviq_total_score'] if 'vviq_total_score' in subject_raw_summary else [])

    # Ensure all expected columns are present and in the correct order
    for col in final_cols:
        if col not in subject_raw_summary:
            subject_raw_summary[col] = pd.NA
    subject_raw_summary = subject_raw_summary[final_cols]

    print("\nTable 0: Mean Raw Scores & VVIQ by Participant:")
    print("(Note: Blurriness is reverse-scored)\n")
    print(subject_raw_summary.to_string())
    print("\n" + "="*50 + "\n")
    # --- END OF NEW BLOCK ---
    
    # (Table 1: Raw Scores - For information only)
    # Reverse-score blurriness for this table specifically to match old output
    # df_clean_raw = df_clean.copy()
    # is_blurriness_raw = (df_clean_raw['parameter'] == 'blurriness')
    # df_clean_raw.loc[is_blurriness_raw, 'selected_level'] = 22 - df_clean_raw.loc[is_blurriness_raw, 'selected_level']
    # raw_summary = df_clean_raw.groupby(['condition', 'parameter'])['selected_level'].mean().unstack()
    raw_summary = df_clean.groupby(['condition', 'parameter'])['selected_level'].mean().unstack()
    param_order = INTENSITY_PARAMS + SPECIFICITY_PARAMS
    print("\n--- VIM Task Results ---")
    print("Table 1: Mean Raw Scores by Condition (Scale 1-21, Informational Only):")
    print("(Note: Blurriness is reverse-scored, where 21 = sharpest)\n")
    print(raw_summary[param_order].to_string())

    # (Table 2: THEORETICAL SCORES - The new primary table)
    intensity_table = df_clean.groupby(['condition', 'parameter'])['intensity_deviation'].mean().unstack()
    specificity_table = df_clean.groupby(['condition', 'parameter'])['specificity_fidelity'].mean().unstack()
    
    print("\n\nTable 2A: Mean Intensity Deviation Scores by Condition:")
    print("(Deviation from neutral point: Positive = more intense, Negative = less intense)\n")
    print(intensity_table[INTENSITY_PARAMS].to_string())
    
    print("\n\nTable 2B: Mean Specificity Fidelity Scores by Condition:")
    print("(0-100 scale: 100% = perfect fidelity, lower = information loss)\n")
    print(specificity_table[SPECIFICITY_PARAMS].to_string())

    # (Table 3: Composite Scores)
    composite_summary = participant_summary.groupby('condition')[['Intensity', 'Specificity']].mean()
    print("\n\nTable 3: Mean Composite Scores by Condition:\n")
    print(composite_summary.to_string())

    # --- Section B: Pairwise Comparisons (on the new composite scores) ---
    print("\n\n--- VIM Pairwise Comparisons (Paired T-Tests on Composite Scores) ---")
    
    for measure in ['Intensity', 'Specificity']:
        print(f"--- Measure: {measure} ---")
        wide_measure_data = participant_summary.pivot(index='sessionID', columns='condition', values=measure)
        for col in wide_measure_data.columns:
            wide_measure_data[col] = pd.to_numeric(wide_measure_data[col], errors='coerce')

        condition_pairs = combinations(wide_measure_data.columns, 2)

        for cond1, cond2 in condition_pairs:
            cond1_scores = wide_measure_data[cond1]
            cond2_scores = wide_measure_data[cond2]
            t_stat, p_value = ttest_rel(cond1_scores, cond2_scores, nan_policy='omit')
            valid_n = len(wide_measure_data[[cond1, cond2]].dropna())
            
            if valid_n < 2:
                print(f"  {cond1:<18} vs. {cond2:<18}: Not enough data.")
                continue
            
            print(f"  {cond1:<18} vs. {cond2:<18}: t = {t_stat:+.3f}, p = {p_value:.3f}  (n={valid_n})")
        print()

    # --- Section B2: VIM Pairwise Comparisons (Individual Parameters) ---
    print("\n\n--- VIM Pairwise Comparisons (Paired T-Tests on Individual Parameters) ---")
    print("Comparing conditions for each of the 6 individual parameters.")
    print("Note: Uses theoretically-transformed scores (Deviation/Fidelity), not raw scores.\n")

    # 1. Create a single 'transformed_score' column to make aggregation easier
    #    It takes the value from 'intensity_deviation' if it exists, otherwise from 'specificity_fidelity'
    df_clean['transformed_score'] = df_clean['intensity_deviation'].fillna(df_clean['specificity_fidelity'])

    # 2. Aggregate the data: get the mean score for each participant, for each condition, for each parameter
    participant_param_means = df_clean.groupby(['sessionID', 'condition', 'parameter'])['transformed_score'].mean().reset_index()

    # 3. Loop through each of the 6 parameters and perform the t-tests
    all_params = INTENSITY_PARAMS + SPECIFICITY_PARAMS

    for param in all_params:
        print(f"--- Parameter: {param} ---")

        # Filter the aggregated data for the current parameter
        param_data = participant_param_means[participant_param_means['parameter'] == param]

        # Pivot the table so each row is a participant and each column is a condition's score
        wide_param_data = param_data.pivot(index='sessionID', columns='condition', values='transformed_score')

        # Ensure all columns are numeric to prevent errors
        for col in wide_param_data.columns:
            wide_param_data[col] = pd.to_numeric(wide_param_data[col], errors='coerce')
        
        # Get all unique pairs of conditions to compare
        condition_pairs = combinations(wide_param_data.columns, 2)

        for cond1, cond2 in condition_pairs:
            cond1_scores = wide_param_data[cond1]
            cond2_scores = wide_param_data[cond2]

            # Run the t-test, ignoring participants with missing data for this pair
            t_stat, p_value = ttest_rel(cond1_scores, cond2_scores, nan_policy='omit')
            valid_n = len(wide_param_data[[cond1, cond2]].dropna())

            if valid_n < 2:
                print(f"  {cond1:<18} vs. {cond2:<18}: Not enough data.")
                continue
            
            print(f"  {cond1:<18} vs. {cond2:<18}: t = {t_stat:+.3f}, p = {p_value:.3f}  (n={valid_n})")
        print()

    # --- END OF NEW BLOCK ---

    # --- Section B3: Confidence Rating Analysis ---
    print("\n" + "="*50)
    print("--- Confidence Rating Analysis ---")
    print("Mean confidence scores (1-7 scale).\n")

    # 1. Preprocess the confidence column to ensure it's numeric
    df_clean['confidence'] = pd.to_numeric(df_clean['confidence'], errors='coerce')

    # Check if there is any confidence data to analyze
    if not df_clean['confidence'].isnull().all():

        # a) Analysis by Parameter (collapsed across conditions)
        print("Table C1: Mean Confidence by Parameter\n")
        confidence_by_param = df_clean.groupby('parameter')['confidence'].agg(['mean', 'std'])
        # Reorder to match the standard parameter order for consistency
        confidence_by_param = confidence_by_param.reindex(param_order)
        print(confidence_by_param.to_string())
        print("\n" + "-"*50)

        # b) Analysis by Condition (collapsed across parameters)
        print("\nTable C2: Mean Confidence by Condition\n")
        confidence_by_cond = df_clean.groupby('condition')['confidence'].agg(['mean', 'std'])
        print(confidence_by_cond.to_string())
        print("\n" + "-"*50)

        # c) Analysis by Parameter x Condition (the full interaction)
        print("\nTable C3: Mean Confidence by Condition and Parameter\n")
        confidence_by_interaction = df_clean.groupby(['condition', 'parameter'])['confidence'].mean().unstack()
        # Reorder the columns for consistency
        confidence_by_interaction = confidence_by_interaction[param_order]
        print(confidence_by_interaction.to_string())

    else:
        print("No valid confidence data was found to analyze.")

    print("\n" + "="*50 + "\n")
    # --- END OF NEW BLOCK ---


    # --- Section C: VVIQ Analysis & Correlation ---

    df['trial_id'] = df['trial_id'].astype(str)
    df_vviq = df[df['trial_id'] == 'VVIQ'].copy()

    if not df_vviq.empty:
        # --- VVIQ Scoring (Unchanged) ---
        vviq_cols = [f'vviq_{i}' for i in range(1, 33)]
        for col in vviq_cols:
            if col not in df_vviq.columns: df_vviq[col] = pd.NA
        df_vviq[vviq_cols] = df_vviq[vviq_cols].apply(pd.to_numeric, errors='coerce')
        df_vviq['vviq_total_score'] = df_vviq[vviq_cols].sum(axis=1)
        vviq_scores = df_vviq[['sessionID', 'vviq_total_score']].dropna()
        
        print(f"\n--- VVIQ Analysis ---")
        print(f"Scored VVIQ data for {len(vviq_scores)} participants.")

        # --- VVIQ Descriptive Statistics (Unchanged) ---
        vviq_mean = vviq_scores['vviq_total_score'].mean()
        vviq_std = vviq_scores['vviq_total_score'].std()
        vviq_min = vviq_scores['vviq_total_score'].min()
        vviq_max = vviq_scores['vviq_total_score'].max()
        print("\nTable 3: VVIQ-2 Total Score Summary:")
        print(f"  - Mean: {vviq_mean:.2f}")
        print(f"  - Std. Dev.: {vviq_std:.2f}")
        print(f"  - Range: {vviq_min:.0f} - {vviq_max:.0f}\n")

        # --- Correlation Analysis (This is the updated part) ---
        
        # We need the mean Intensity and Specificity scores for EACH participant (collapsed across conditions)
        participant_overall_means = participant_summary.groupby('sessionID')[['Intensity', 'Specificity']].mean().reset_index()

        # Merge the VVIQ scores with the mean composite scores
        merged_data_corr = pd.merge(participant_overall_means, vviq_scores, on='sessionID')
        
        print("\nTable 4: Pearson Correlations with Total VVIQ Score:\n")
        
        # Check if we have enough data to run correlations
        if len(merged_data_corr) >= 2:
            # Correlate VVIQ with Intensity
            r_intensity, p_intensity = pearsonr(merged_data_corr['Intensity'], merged_data_corr['vviq_total_score'])
            print(f"  {'Intensity':>15}: r = {r_intensity:+.3f}, p = {p_intensity:.3f}")

            # Correlate VVIQ with Specificity
            r_specificity, p_specificity = pearsonr(merged_data_corr['Specificity'], merged_data_corr['vviq_total_score'])
            print(f"  {'Specificity':>15}: r = {r_specificity:+.3f}, p = {p_specificity:.3f}")

            # Optional: For Hypothesis 3, we can create a Total Vividness score here
            merged_data_corr['TotalVividness'] = merged_data_corr[['Intensity', 'Specificity']].mean(axis=1)
            r_total, p_total = pearsonr(merged_data_corr['TotalVividness'], merged_data_corr['vviq_total_score'])
            print(f"  {'TotalVividness':>15}: r = {r_total:+.3f}, p = {p_total:.3f} (n={len(merged_data_corr)})")

        else:
            print("  Not enough complete participant data to calculate correlations.")

         # --- NEW BLOCK: Correlation Analysis Part 2: Individual Parameters ---
        print("\n\nTable 5: Pearson Correlations with VVIQ Score (Individual Parameters):\n")
        print("(Scores for each parameter are averaged across all conditions for each participant)\n")

        # 1. Get the overall mean for each parameter for each participant (collapsing conditions)
        overall_param_means = participant_param_means.groupby(['sessionID', 'parameter'])['transformed_score'].mean().reset_index()

        # 2. Pivot this data to a "wide" format
        wide_param_means = overall_param_means.pivot(index='sessionID', columns='parameter', values='transformed_score').reset_index()

        # 3. Merge with VVIQ scores
        merged_param_corr = pd.merge(wide_param_means, vviq_scores, on='sessionID')

        # 4. Loop through each parameter and calculate the correlation
        if len(merged_param_corr) >= 2:
            for param in all_params:
                # Check that the column exists and has data before trying to correlate
                if param in merged_param_corr.columns and not merged_param_corr[param].isnull().all():
                    # Pearsonr automatically handles NaNs by ignoring pairs where either value is missing
                    r_param, p_param = pearsonr(merged_param_corr[param], merged_param_corr['vviq_total_score'])
                    print(f"  {param:>15}: r = {r_param:+.3f}, p = {p_param:.3f}")
            print(f"\n  (Based on n={len(merged_param_corr)} participants with complete data)")
        else:
            print("  Not enough complete participant data to calculate parameter correlations.")
        # --- END OF NEW BLOCK ---

    else:
        print("\n--- VVIQ Analysis ---")
        print("No VVIQ data found in the file.")

# --- Run the analysis ---
if __name__ == "__main__":
    analyze_vim_data(GOOGLE_SHEET_URL)