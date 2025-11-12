import { useRouteError } from "react-router-dom";
import Button from "../FormElements/Button";

export default function Error() {
  const error = useRouteError();

  return (
    <div className="hero bg-base-200 widescreen:section-min-height tallscreen:section-min-height">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">An error Occured</h1>
          <p className="py-6">Error: {error.message}</p>
          <p className="py-4">
            {error.statusText || "Client Side Error"} - {error.status || "500"}
          </p>
          <Button to="/">Return to Home</Button>
        </div>
      </div>
    </div>
  );
}
