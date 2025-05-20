# Test Plan (Version 1)

This document outlines how the application will be verified. It summarizes the testing strategy, tools and sample cases to ensure the site meets the requirements.

## Overview

Since this is a personal rapid prototype, the testing approach will be lightweight and focused on manual verification of core functionality. There's no need for extensive automated testing or complex CI pipelines. The goal is to ensure the application works as expected in the developer's primary browser with minimal overhead.

## Manual Testing Checklist

### Layout and Navigation

1. **Basic Layout**
   - [ ] All UI elements are correctly positioned
   - [ ] Layout is responsive and adapts to different window sizes
   - [ ] No obvious visual glitches

2. **Question Selector Sidebar**
   - [ ] Appears when hovering near left edge
   - [ ] Lists all 50 question slots
   - [ ] Selecting a question loads its details
   - [ ] Selected question is highlighted

3. **Settings Sidebar**
   - [ ] Appears when hovering near right edge
   - [ ] Mode toggle works (Learning/Mock)
   - [ ] Download/Upload buttons are functional

4. **Keyboard Shortcuts**
   - [ ] Shortcuts work for opening/closing sidebars
   - [ ] Focus can be moved between main UI elements
   - [ ] Check shortcut triggers validation

### Core Functionality

1. **Code Editor**
   - [ ] Monaco editor loads with Python syntax highlighting
   - [ ] Can type and edit code
   - [ ] Code persists when switching between questions

2. **Code Validation**
   - [ ] "Check" button compares solution against expected output
   - [ ] Issue panel appears when there are validation problems
   - [ ] Correct solutions are recognized

3. **Voice Commands**
   - [ ] Voice button activates listening
   - [ ] Transcription appears in toast
   - [ ] Basic navigation commands work ("go to question five")
   - [ ] Code editing commands work if implemented

4. **Data Persistence**
   - [ ] Code changes are saved to localStorage
   - [ ] Settings are preserved between sessions
   - [ ] Export/import of localStorage data works

## Browser Testing

Since this is a personal tool, test in your primary development browser:
- [ ] Chrome (primary support target)

Optional testing in other browsers if time permits:
- [ ] Firefox
- [ ] Safari

## Smoke Testing

Before considering the prototype complete, verify these core use cases:

1. **Full Question Flow**
   - [ ] Open the application
   - [ ] Select a question
   - [ ] Write a solution
   - [ ] Validate the solution
   - [ ] View and correct issues
   - [ ] Re-validate successfully

2. **localStorage Persistence**
   - [ ] Make changes to code and settings
   - [ ] Close and reopen the browser
   - [ ] Verify all changes persisted

3. **Import/Export Flow**
   - [ ] Export localStorage data
   - [ ] Clear localStorage (via developer tools)
   - [ ] Import the exported file
   - [ ] Verify all data is restored correctly

## No Automated Testing Required

Given the rapid prototype nature of this project, no automated testing is required for version 1. Manual verification by the developer is sufficient to ensure the application meets personal needs.

Future versions might consider adding:
- Basic Jest tests for critical utility functions
- Simple React Testing Library tests for key components
- Playwright or Cypress for critical user flows

But these are explicitly out of scope for the current version.
