import pandas as pd

# Load the CSV data into a DataFrame using the correct delimiter
nft_data_df = pd.read_csv('nft_data.csv', delimiter=';')

# Extracting names from the 'Name' column
nft_names = nft_data_df['Family'].dropna().tolist()

# Function to count words in the NFT names
def count_words_in_names(names):
    word_count = {}
    for name in names:
        # Split names into words based on spaces, handling potential punctuation
        words = name.replace(';', ' ').replace(',', ' ').split()
        for word in words:
            word = word.lower()  # Normalize to lowercase for consistent counting
            if word not in word_count:
                word_count[word] = 1
            else:
                word_count[word] += 1
    return word_count

# Count words in NFT names
word_counts = count_words_in_names(nft_names)

# Output the word count dictionary
for word, count in sorted(word_counts.items(), key=lambda item: item[1], reverse=True):
    print(f"'{word}': {count}")
