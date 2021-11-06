import React, { useContext, useState } from "react";
import Link from '@docusaurus/Link';
import { AmplitudeContext } from '../components/AmplitudeClient';

const DOC_FEEDBACK_EVENT = 'Submit Doc Feedback';
type FeedbackTypes = 'quality' | 'question';

const submitAmplitudeFeedback = (client: any, feedbackType: FeedbackTypes, docId: string, value: string) => {
    client?.logEvent(DOC_FEEDBACK_EVENT, { type: feedbackType, value: value } );
}

export function Feedback(props: { docId: string }) {
    const amplitudeClient = useContext(AmplitudeContext);
    const [qualitySubmitted, setQualitySubmitted] = useState(undefined);
    const [questionSubmitted, setQuestionSubmitted] = useState(false);
    const [questionInput, setQuestionInput] = useState('');

    const feedbackHandler = (feedbackType: FeedbackTypes, value: string) => {
        return () => {
            setQualitySubmitted(value);
            submitAmplitudeFeedback(amplitudeClient, feedbackType, props.docId, value);
        };
    };
    const questionHandler = () => {
        setQuestionSubmitted(true);
        submitAmplitudeFeedback(amplitudeClient, 'question', props.docId, questionInput);
    };

    return <div>
        <hr />
        <p>Was this page helpful?</p>
        <div className="feedback-button-container">
            <button className={ `feedback-button ${qualitySubmitted === 'yes' ? 'selected' : ''}` } onClick={feedbackHandler('quality', 'yes')} disabled={qualitySubmitted}>Yes</button>
            <button className={ `feedback-button ${qualitySubmitted === 'no' ? 'selected' : ''}` } onClick={feedbackHandler('quality', 'no')} disabled={qualitySubmitted}>No</button>
        </div>
        {qualitySubmitted &&
            <div className="feedback-question-section">
                <br/>
                <p>
                    Thanks for your feedback.<br/>
                    If you have a specific question that you'd like answered, submit it here or join our conversation on <Link to="https://authzed.com/discord">Discord</Link>.
                </p>
                <textarea value={questionInput} onChange={event => setQuestionInput(event.target.value)} disabled={questionSubmitted} />
                <button className="feedback-button" onClick={questionHandler} disabled={questionSubmitted}>{questionSubmitted ? 'Thanks!' : 'Submit'}</button>
            </div>
        }
    </div>;
}
