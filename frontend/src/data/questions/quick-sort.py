"""
- Task: Implement quicksort algorithm
- Constraint: In-place sorting, O(n log n) average case
- Example:
  - Input: [3, 6, 8, 10, 1, 2, 1]
  - Output: [1, 1, 2, 3, 6, 8, 10]
"""

def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array
        pi = partition(arr, low, high)
        
        # Recursively sort elements
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Test
arr = [3, 6, 8, 10, 1, 2, 1]
quicksort(arr)
print(arr)
