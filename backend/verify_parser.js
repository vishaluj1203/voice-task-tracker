const { parseTask } = require('./src/parser');

const testCases = [
    "Create a high priority task to review the pull request for the authentication module by tomorrow evening at 6:00 PM",
    "Remind me to call John next Monday morning",
    "Urgent: Fix the production bug by today 2pm",
    "Low priority task: Update documentation",
    "Finish the report status in progress",
    "Create a task to review authentication module"
];

testCases.forEach(text => {
    console.log('---');
    console.log(`Input: "${text}"`);
    console.log('Output:', JSON.stringify(parseTask(text), null, 2));
});
