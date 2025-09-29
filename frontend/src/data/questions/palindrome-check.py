"""
- Task: Check if string is palindrome (ignores case, non-alphanumeric)
- Constraint: O(1) extra space, two pointers
- Example:
  - Input: "A man, a plan, a canal: Panama"
  - Output: True
"""

def is_palindrome(s):
    """
    Check if string is palindrome using two pointers
    """
    # Convert to lowercase and keep only alphanumeric
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    
    left = 0
    right = len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    
    return True

# Test cases
test1 = "A man, a plan, a canal: Panama"
test2 = "race a car"
print(is_palindrome(test1))  # True
print(is_palindrome(test2))  # False
