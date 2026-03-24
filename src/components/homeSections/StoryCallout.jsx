import { Sparkles } from "lucide-react";

export default function StoryCallout() {
  return (
    <div className="story-callout-wrapper">
      <div className="story-callout-card">
        <div className="story-callout-icon">
          <Sparkles size={36} strokeWidth={1.5} />
        </div>
        <h2 className="story-callout-heading">
          What if you were in the story?
        </h2>
        <p className="story-callout-subtext">
          Pick any anime above and start writing your own version of the story.
          Be the hero, the villain,
          <br />
          {/* Avoid `<br />` for layout if CSS spacing can solve it. or rewrite */}
          everything as the creator.
        </p>
      </div>
    </div>
  );
}
