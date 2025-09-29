"""
- Task: Reverse a string in-place
- Constraint: O(1) extra space, modify input array
- Example:
  - Input: ["h","e","l","l","o"]
  - Output: ["o","l","l","e","h"]
"""

def reverse_string(s):
    """
    Reverse string in-place using two pointers
    """
    left = 0
    right = len(s) - 1
    
    while left < right:
        # Swap characters
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    
    return s

# Test
s = ["h","e","l","l","o"]
result = reverse_string(s)
print(result)  # ["o","l","l","e","h"]
