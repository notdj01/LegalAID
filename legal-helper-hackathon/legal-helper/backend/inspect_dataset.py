from datasets import load_dataset

print("Loading dataset...")
dataset = load_dataset("opennyaiorg/InJudgements_dataset", split="train", streaming=True)

print("Inspecting first item...")
for item in dataset:
    print("Keys found:")
    for key in item.keys():
        print(f"- {key}")
    break
