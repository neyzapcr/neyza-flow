import { createRoot } from "react-dom/client";
import "./tailwind.css";
import EventApp from "./EventApp";

createRoot(document.getElementById("root")).render(
  <div>
    <EventApp/>
  </div>
);