module.exports = function feedbackTemplate(feedbackText) {
    return {
      subject: 'Account Deletion Feedback',
      html: `
        <h1>Feedback from a User</h1>
        <p>Below is the feedback provided by the user:</p>
        <blockquote>${feedbackText}</blockquote>
      `,
    };
  };
  