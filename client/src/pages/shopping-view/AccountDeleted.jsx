import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { toast } from "../../components/ui/use-toast";
import axios from "axios";

function AccountDeleted() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
  
    if (!feedback.trim()) {
      toast({ title: "Feedback required", description: "Please provide your feedback." });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-feedback', { feedbackText: feedback }); // Add server URL
      if (response.data.success) {
        toast({ title: "Thank you!", description: response.data.message });
        setIsSubmitted(true); // Disable the button after success
      } else {
        toast({ title: "Error", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({ title: "Error", description: "Failed to send feedback. Please try again later." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-gray-800">
            We're Sorry to See You Go
          </CardTitle>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Please share why you decided to delete your account. Your feedback helps us improve.
          </p>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-4">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us why you decided to leave..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmitted}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitted}>
              {isSubmitted ? "Feedback Submitted" : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter>
          <p className="text-center text-gray-600 mb-4">
            Would you like to give us another chance? Come back and register again!
          </p>
          <Button onClick={() => window.location.href = "/auth/register"} className="w-full bg-blue-600 text-white">
            Register Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountDeleted;
