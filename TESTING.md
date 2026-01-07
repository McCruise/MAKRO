# Testing Guide - Milestone 1

## Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to the URL shown (typically `http://localhost:5173`)

## Test Checklist

### ✅ Test 1: Input Form & Add Content

**Steps:**
1. You should see a form titled "Add New Content"
2. Fill in the form:
   - **Title**: "Fed Rate Cut Expectations"
   - **Source**: "John Doe"
   - **Content Type**: Select "Article" (or any type)
   - **Date**: Use today's date (default)
   - **Content/Link**: Paste some text like "The Federal Reserve is expected to cut rates in Q2 2024 due to declining inflation..."
3. Click "Add Content" button

**Expected Result:**
- Form should clear after submission
- A new card should appear in the grid below the form
- Card should show the title, source, date, and content type badge
- Card should show a preview of the content text

---

### ✅ Test 2: Display Cards in Grid

**Steps:**
1. Add 2-3 more content items with different types (article, link, tweet, file)
2. Observe the grid layout

**Expected Result:**
- Cards should display in a responsive grid (1 column on mobile, 2-3 on desktop)
- Each card should have:
  - Title at the top
  - Content type badge (different colors for each type)
  - Source name
  - Date
  - Truncated text preview
- Cards should have hover effects (shadow increases on hover)

---

### ✅ Test 3: View Content Details

**Steps:**
1. Click on any content card

**Expected Result:**
- A modal should open showing:
  - Full title in the header
  - Close button (×) in the top right
  - Source, date, and content type
  - Full content text in a gray box
  - Extracted text in a blue box (if available)
  - Created timestamp at the bottom
- Clicking outside the modal or the × button should close it

---

### ✅ Test 4: Data Persistence (LocalStorage)

**Steps:**
1. Add a few content items
2. Refresh the browser (F5 or Ctrl+R)
3. Check if your content is still there

**Expected Result:**
- All content items should still be visible after refresh
- Nothing should be lost
- Cards should appear in the same order (newest first)

---

### ✅ Test 5: Text Parser

**Steps:**
1. Add content with extra whitespace:
   ```
   This    has    multiple    spaces
   
   And    blank    lines
   ```
2. Submit the form
3. View the detail modal

**Expected Result:**
- In the "Extracted Text" section, whitespace should be cleaned up
- Multiple spaces should become single spaces
- Text should be properly formatted

---

### ✅ Test 6: Different Content Types

**Steps:**
1. Add content with each type:
   - **Article**: Regular text content
   - **Link**: A URL like "https://example.com/article"
   - **Tweet**: Short text like a tweet
   - **File**: Any text content

**Expected Result:**
- Each type should have a different colored badge:
  - Article: Blue
  - Link: Green
  - File: Purple
  - Tweet: Sky blue
- Cards should display correctly for all types

---

### ✅ Test 7: Empty State

**Steps:**
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Delete the `makro_content` key
4. Refresh the page

**Expected Result:**
- Should see message: "No content yet. Add your first item to get started!"
- Form should still be visible and functional

---

### ✅ Test 8: Form Validation

**Steps:**
1. Try to submit the form without a title
2. Fill in only the title, leave other fields empty
3. Submit

**Expected Result:**
- Form should show an alert if title is missing
- Form should accept submissions with only title filled
- Empty fields should display as "Unknown" or "No date" in the card

---

## Quick Test Scenarios

### Scenario 1: Add Multiple Articles
Add 5 different articles about macro topics. Verify they all appear, can be clicked, and persist after refresh.

### Scenario 2: Mix Content Types
Add one of each content type (article, link, file, tweet). Verify badges show correct colors and all display properly.

### Scenario 3: Long Content
Add content with a very long text (500+ words). Verify:
- Card shows truncated preview
- Detail modal shows full text
- Text is scrollable in modal if needed

### Scenario 4: Special Characters
Add content with special characters, emojis, or foreign language text. Verify it displays correctly.

---

## Troubleshooting

**Issue: Page is blank**
- Check browser console for errors (F12)
- Verify `npm run dev` is running
- Check that all files are in the correct locations

**Issue: Content not persisting**
- Check browser console for localStorage errors
- Verify browser allows localStorage (not in private/incognito mode)
- Check Application tab in DevTools → Local Storage for `makro_content` key

**Issue: Styles not loading**
- Verify Tailwind is properly configured
- Check that `src/styles/index.css` is imported in `main.jsx`
- Restart the dev server

**Issue: Form not submitting**
- Check browser console for errors
- Verify all required fields are filled
- Check that JavaScript is enabled

---

## Success Criteria

✅ All 8 tests pass  
✅ Content persists after refresh  
✅ Cards display correctly in grid  
✅ Detail modal works  
✅ Form validation works  
✅ Different content types show correct badges  
✅ Text parsing works correctly  

If all these pass, **Milestone 1 is complete!** 🎉
