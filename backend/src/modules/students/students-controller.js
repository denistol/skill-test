const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");
const { ROLE_NAMES } = require("../../constants/role-names");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, section, roll } = req.query;

    const className = req.query.className || req.query.class;
    const students = await getAllStudents({ name, className, section, roll });
    const studentsWithRole = (students || []).map((s) => ({ ...s, role: ROLE_NAMES.STUDENT }));

    res.json({ students: studentsWithRole });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const message = await addNewStudent(payload);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = Number(id);
    const payload = { ...req.body, userId };

    const message = await updateStudent(payload);
    res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviewerId = req.user.id;
    const { status } = req.body;

    const message = await setStudentStatus({
        userId: Number(id),
        reviewerId,
        status: Boolean(status)
    });

    res.json(message);
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviewerId = req.user.id;

    const message = await setStudentStatus({
        userId: Number(id),
        reviewerId,
        status: false
    });

    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
