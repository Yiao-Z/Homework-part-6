"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createStudent, deleteStudent } from "./students";

export async function createStudentAction(_previousState, formData) {
  try {
    await createStudent({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      street_address: formData.get("street_address"),
      city: formData.get("city"),
      province_state: formData.get("province_state"),
      country: formData.get("country"),
      postal_code: formData.get("postal_code"),
      program: formData.get("program"),
      year: formData.get("year"),
      student_number: formData.get("student_number"),
    });
  } catch (error) {
    if (
      error.message ===
        "A student with that email is already in the directory." ||
      error.message ===
        "That student number or email is already in the directory." ||
      error.message === "Enter a valid email address." ||
      error.message ===
        "Enter a valid postal code for the selected country." ||
      error.message === "Choose a valid year (Y1 to Y4)." ||
      error.message === "Student number and full name are required." ||
      error.message ===
        "Complete all required student, program, and year fields." ||
      error.message ===
        "Complete all required student, address, program, and year fields."
    ) {
      return { error: error.message };
    }

    console.error("Error adding student:", error);
    return {
      error: "The student could not be added. Check the database connection and try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/students");
  redirect("/");
}

export async function deleteStudentAction(id) {
  try {
    await deleteStudent(id);
  } catch (error) {
    console.error("Error removing student:", error);
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/students");
}
