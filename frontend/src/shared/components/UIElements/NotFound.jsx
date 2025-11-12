import Button from "../FormElements/Button";

export default function NotFound() {
  return (
    <div className="hero bg-base-200 widescreen:section-min-height tallscreen:section-min-height">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Page Not Found</h1>
          <p className="py-6">
            Sorry, the page you were looking for was not found
          </p>
          <Button to="/">Return to Home</Button>
        </div>
      </div>
    </div>
  );
}
