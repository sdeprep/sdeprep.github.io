"""
- Task: Implement bubble sort algorithm
- Constraint: Compare adjacent elements, O(n²) time
- Example:
  - Input: [64, 34, 25, 12, 22, 11, 90]
  - Output: [11, 12, 22, 25, 34, 64, 90]
"""

def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        # Flag to optimize - if no swaps, array is sorted
        swapped = False
        
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swaps occurred, array is sorted
        if not swapped:
            break
    
    return arr

# Test
arr = [64, 34, 25, 12, 22, 11, 90]
result = bubble_sort(arr.copy())
print(result)
