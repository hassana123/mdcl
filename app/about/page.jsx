import { redirect } from "next/navigation";

export default function About() {
  redirect("/about/profile");
  return null;
}