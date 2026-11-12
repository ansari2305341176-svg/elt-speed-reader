
import { supabase } from "./supabase";

export async function submitStudentResult(result) {
  const { error } = await supabase
    .from("student_results")
    .insert({
      student_name: result.studentName.trim(),
      student_id: result.studentId.trim(),
      total_score: result.totalScore,
      skimming_score: result.skimmingScore,
      scanning_score: result.scanningScore,
      answers: result.answers,
      revision_completed: result.revisionCompleted ?? false,
    });

  if (error) {
    console.error("Result submission failed:", error);
    throw error;
  }

  return true;
}

export async function getStudentResults() {
  const { data, error } = await supabase
    .from("student_results")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function teacherLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("teacher_profiles")
    .select("user_id, full_name")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error("This account is not authorised as a teacher.");
  }

  return { user: data.user, profile };
}

export async function teacherLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
