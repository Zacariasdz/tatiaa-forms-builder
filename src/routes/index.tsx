import { createFileRoute } from "@tanstack/react-router";
import FormBuilder from "@/components/builder/FormBuilder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viper Engine | Advanced Form Builder" },
      {
        name: "description",
        content:
          "Premium dark mode form builder with drag-and-drop, themes, logic, validation and analytics.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <FormBuilder />;
}
