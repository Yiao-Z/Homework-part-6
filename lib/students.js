import db from "./database";

export async function getStudentSchema() {
  const [columns] = await db.query("SHOW COLUMNS FROM students");
  const columnNames = new Set(columns.map((column) => column.Field));

  if (columnNames.has("first_name") && columnNames.has("last_name")) {
    return { kind: "registration" };
  }

  if (
    columnNames.has("student_number") &&
    columnNames.has("name") &&
    columnNames.has("year_level")
  ) {
    return { kind: "legacy" };
  }

  throw new Error(
    "The students table has an unsupported schema. Use the supplied student registration SQL or the earlier student management schema."
  );
}

export async function getAllStudents() {
  const schema = await getStudentSchema();
  if (schema.kind === "legacy") {
    const [students] = await db.query(`
      SELECT
        id,
        student_number,
        name AS first_name,
        '' AS last_name,
        email,
        NULL AS phone,
        '' AS street_address,
        '' AS city,
        '' AS province_state,
        '' AS country,
        '' AS postal_code,
        program,
        CONCAT('Y', year_level) AS \`year\`,
        created_at
      FROM students
      ORDER BY created_at DESC, id DESC
    `);

    return students;
  }

  const [students] = await db.query(`
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      street_address,
      city,
      province_state,
      country,
      postal_code,
      program,
      \`year\`,
      created_at
    FROM students
    ORDER BY created_at DESC, id DESC
  `);

  return students;
}

export async function getStudentStats() {
  const schema = await getStudentSchema();
  const yearColumn = schema.kind === "legacy" ? "year_level" : "`year`";
  const [rows] = await db.query(`
    SELECT
      COUNT(*) AS total_students,
      COUNT(DISTINCT program) AS programs,
      COUNT(DISTINCT ${yearColumn}) AS year_levels
    FROM students
  `);

  return {
    totalStudents: Number(rows[0].total_students),
    programs: Number(rows[0].programs),
    yearLevels: Number(rows[0].year_levels),
  };
}

export async function createStudent(studentData) {
  const schema = await getStudentSchema();
  const email = String(studentData.email || "")
    .trim()
    .toLowerCase();
  const program = String(studentData.program || "").trim();
  const year = String(studentData.year || "").trim().toUpperCase();

  if (!email || !program || !year) {
    throw new Error("Complete all required student, program, and year fields.");
  }

  if (
    !/^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
      email
    )
  ) {
    throw new Error("Enter a valid email address.");
  }

  if (!/^Y[1-4]$/.test(year)) {
    throw new Error("Choose a valid year (Y1 to Y4).");
  }

  if (schema.kind === "legacy") {
    const studentNumber = String(studentData.student_number || "")
      .trim()
      .toUpperCase();
    const name = [
      String(studentData.first_name || "").trim(),
      String(studentData.last_name || "").trim(),
    ]
      .filter(Boolean)
      .join(" ");

    if (!studentNumber || !name) {
      throw new Error("Student number and full name are required.");
    }

    try {
      const [result] = await db.query(
        `INSERT INTO students (student_number, name, email, program, year_level)
         VALUES (?, ?, ?, ?, ?)`,
        [studentNumber, name, email, program, Number(year.slice(1))]
      );

      return result.insertId;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error(
          "That student number or email is already in the directory."
        );
      }

      console.error("Error creating student:", error);
      throw error;
    }
  }

  const firstName = String(studentData.first_name || "").trim();
  const lastName = String(studentData.last_name || "").trim();
  const phone = String(studentData.phone || "").trim();
  const streetAddress = String(studentData.street_address || "").trim();
  const city = String(studentData.city || "").trim();
  const provinceState = String(studentData.province_state || "").trim();
  const country = String(studentData.country || "").trim();
  const postalCode = String(studentData.postal_code || "").trim().toUpperCase();

  if (
    !firstName ||
    !lastName ||
    !email ||
    !streetAddress ||
    !city ||
    !provinceState ||
    !country ||
    !postalCode ||
    !program ||
    !year
  ) {
    throw new Error(
      "Complete all required student, address, program, and year fields."
    );
  }

  const normalizedCountry = country.toLowerCase();
  const isCanadianPostalCode =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTVXY][ -]?\d[ABCEGHJ-NPRSTVXY]\d$/i.test(
      postalCode
    );
  const isUsPostalCode = /^\d{5}(?:-\d{4})?$/.test(postalCode);
  const isGeneralPostalCode =
    /^[A-Z0-9](?:[A-Z0-9 -]{0,10}[A-Z0-9])?$/.test(postalCode) &&
    /[A-Z0-9]/.test(postalCode);

  if (
    (normalizedCountry === "canada" && !isCanadianPostalCode) ||
    (["united states", "united states of america", "usa", "us"].includes(
      normalizedCountry
    ) &&
      !isUsPostalCode) ||
    (!["canada", "united states", "united states of america", "usa", "us"].includes(
      normalizedCountry
    ) &&
      !isGeneralPostalCode)
  ) {
    throw new Error("Enter a valid postal code for the selected country.");
  }

  if (!/^Y[1-4]$/.test(year)) {
    throw new Error("Choose a valid year (Y1 to Y4).");
  }

  try {
    const [result] = await db.query(
      `INSERT INTO students
        (first_name, last_name, email, phone, street_address, city,
         province_state, country, postal_code, program, \`year\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        phone || null,
        streetAddress,
        city,
        provinceState,
        country,
        postalCode,
        program,
        year,
      ]
    );

    return result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("A student with that email is already in the directory.");
    }

    console.error("Error creating student:", error);
    throw error;
  }
}

export async function deleteStudent(id) {
  const studentId = Number(id);

  if (!Number.isSafeInteger(studentId) || studentId < 1) {
    throw new Error("A valid student record is required.");
  }

  const [result] = await db.query("DELETE FROM students WHERE id = ?", [
    studentId,
  ]);

  if (result.affectedRows === 0) {
    throw new Error("Student not found.");
  }
}
