export async function submitLevelResults({
  user_id,
  level,
  quizzes,
  cat4File,
}: {
  user_id: string;
  level: string;
  quizzes: any;
  cat4File?: File;
}) {
  const formData = new FormData();
  formData.append("quizzes", JSON.stringify(quizzes));
  formData.append("user_id", user_id);
  formData.append("level", level);

  if (level === "advanced" && cat4File) {
    formData.append("cat4", cat4File);
  }

  console.log("FormData ready →", [...formData.entries()]);

  const res = await fetch("http://localhost:5000/api/quiz/submit", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API failed");
  }

  return res.json();
}
