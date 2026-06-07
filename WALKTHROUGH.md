# Preproute Walkthrough Video Script

Use this as the exact flow for the task walkthrough video. Keep the app open at `http://localhost:5173`.

## 1. Start From Login

1. Open the app and show the login page.
2. Enter the test credentials:
   - User ID: `vedant-admin`
   - Password: `vedant123`
3. Click `Login`.
4. Show that the app redirects to the protected dashboard.

Suggested narration: "The app authenticates the admin user, stores the token, and protects the internal test management pages."

## 2. Dashboard Of All Tests

1. Show the dashboard/test list.
2. Point out the existing tests, status badges, and action buttons.
3. Click `Test Tracking` in the sidebar and show the tracking page.
4. Return to `Test Creation`.

Suggested narration: "The dashboard gives moderators a quick view of all tests, and the tracking page separates published or scheduled test status."

## 3. Create A New Test

1. Click `Test Creation`.
2. Fill the form:
   - Type: `Chapter Wise`
   - Subject: choose any available subject, preferably `English` if present.
   - Name of Test: `Chapter 1 Grammar Practice`
   - Topic: choose one or more topics, preferably `Grammar` and `Writing` if present.
   - Sub Topic: choose one, preferably `Application` if present.
   - Duration: `60`
   - Difficulty: `Easy`
   - Wrong Answer: `-1`
   - Unattempted: `0`
   - Correct Answer: `5`
   - No of Questions: `3`
   - Total Marks: should calculate from the marks/questions flow.
3. Click `Next`.
4. Confirm that the app moves to the MCQ creation screen.

Suggested narration: "The form is validated with React Hook Form and Zod, then the test draft is saved through the backend API before moving to question creation."

## 4. Add MCQ Manually

1. On the question creation page, show the test summary card.
2. In the editor, type:

```text
Choose the correct sentence:
```

3. Select the words `correct sentence` and click:
   - `B` to apply bold formatting.
   - `I` to apply italic formatting.
   - `U` to apply underline formatting.
   - `list` to show bullet insertion.
4. Add an image URL:

```text
https://placehold.co/640x300/png?text=Grammar+Question
```

5. Show the image preview below the editor.
6. Fill options:
   - Option 1: `He go to school every day.`
   - Option 2: `He goes to school every day.`
   - Option 3: `He going to school every day.`
   - Option 4: `He gone to school every day.`
7. Select Option 2 as the correct answer.
8. Add solution:

```text
The singular subject "He" takes the verb "goes" in simple present tense.
```

9. In `Question settings`, set:
   - Difficulty: `Easy`
   - Topic: choose a topic
   - Sub-topic: choose a sub-topic

Suggested narration: "The MCQ editor supports question text, formatting, options, correct-answer selection, explanations, image previews, and per-question metadata."

## 5. Upload Questions Through CSV

1. Click the `CSV` button.
2. Select the provided file:

```text
demo-questions.csv
```

3. Show the import success toast.
4. Click through the sidebar question list to show the imported questions.
5. Confirm imported fields are visible: question, options, correct answer, explanation, difficulty, topic, subtopic, and image URL.

Suggested narration: "CSV import lets moderators bulk-create questions while still allowing review and edits in the same interface."

## 6. Save Questions And Preview

1. Click `Next`.
2. Wait for the success toast.
3. Show the preview/publish screen.
4. Scroll through the preview list and show:
   - Test summary
   - Manual MCQ
   - CSV-imported MCQs
   - Correct answers
   - Image preview/output

Suggested narration: "Before publishing, the moderator can review the full test output and confirm all questions were added correctly."

## 7. Publish The Test

Option A: Publish immediately

1. Keep `Publish Now` selected.
2. Under `Live Until`, choose `Custom Duration`.
3. Set end date and time.
4. Click `Confirm`.

Option B: Schedule publish

1. Switch to `Schedule Publish`.
2. Select a publish date and time.
3. Set `Live Until`.
4. Click `Confirm`.

Suggested narration: "The publish screen supports immediate publishing as well as scheduled publishing, including availability duration settings."

## 8. Final Published Output

1. After the publish success toast, show that the app returns to the dashboard.
2. Find the newly created test in the table.
3. Show its final status as live/published or scheduled.
4. Open `Test Tracking` and show the final published/scheduled test output there too.

Suggested narration: "This completes the flow from login, test creation, manual and CSV question entry, preview, and publishing to final tracking."

## 9. Extra Features To Mention

- Protected routes redirect unauthenticated users back to login.
- Axios interceptor adds the auth token to API requests.
- Vite proxy avoids browser CORS issues during local development.
- Form validation prevents incomplete test details.
- Toast notifications show success and failure states.
- The edit icon opens the edit test details flow.
- Responsive CSS keeps the Figma-style layout inside the viewport.

## 10. Final Recording Checklist

- Login page shown.
- Dashboard shown.
- New test created.
- Difficulty, topic, and subtopic set on test details.
- Manual MCQ added.
- Formatting toolbar demonstrated.
- Image added to at least one question.
- CSV upload demonstrated.
- Question-level difficulty/topic/subtopic shown.
- Preview screen shown.
- Publish flow completed.
- Final published/scheduled output shown on dashboard/tracking.
