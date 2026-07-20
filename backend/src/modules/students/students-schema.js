const { z } = require("zod");

const studentBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email address"),
    class: z.string().min(1, "Class is required"),
    section: z.string().optional(),
    roll: z.string().min(1, "Roll is required"),
    admissionDate: z.string().min(1, "Admission date is required"),
    currentAddress: z.string().min(1, "Current address is required"),
    permanentAddress: z.string().min(1, "Permanent address is required"),
    fatherName: z.string().min(1, "Father name is required"),
    fatherPhone: z.string().optional(),
    motherName: z.string().optional(),
    motherPhone: z.string().optional(),
    guardianName: z.string().min(1, "Guardian name is required"),
    guardianPhone: z.string().min(1, "Guardian phone is required"),
    relationOfGuardian: z.string().min(1, "Relation of guardian is required"),
    systemAccess: z.boolean().optional(),
});

const AddStudentSchema = z.object({
    body: studentBodySchema,
});

const UpdateStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Student id must be a positive integer"),
    }),
    body: studentBodySchema.extend({
        systemAccess: z.boolean(),
    }),
});

const GetStudentDetailSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Student id must be a positive integer"),
    }),
});

const GetAllStudentsSchema = z.object({
    query: z.object({
        name: z.string().optional(),
        class: z.string().optional(),
        className: z.string().optional(),
        section: z.string().optional(),
        roll: z.string().optional(),
    }),
});

const StudentStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Student id must be a positive integer"),
    }),
    body: z.object({
        status: z.boolean({ required_error: "Status is required" }),
    }),
});

const DeleteStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Student id must be a positive integer"),
    }),
});

module.exports = {
    AddStudentSchema,
    UpdateStudentSchema,
    GetStudentDetailSchema,
    GetAllStudentsSchema,
    StudentStatusSchema,
    DeleteStudentSchema,
};
