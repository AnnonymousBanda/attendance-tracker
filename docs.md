# API Documentation

## Endpoints

### 1. Get Lectures
**Endpoint:** `getLectures(userID, semester, date)`  
**Description:** Fetches all lectures for a specific user on a given date within a semester.  
**Parameters:**  
- `userID` (string, required): Unique identifier of the user.  
- `semester` (string, required): The semester for which lectures are fetched.  
- `date` (string, required, format: dd/mm/yyyy): The date for which lectures are retrieved.  
**Response:**
```json
{
  "status": 200,
  "message": "Lectures fetched successfully",
  "data": []
}
```

---

### 2. Add Extra Lecture
**Endpoint:** `addExtraLecture(userID, lecture, semester, date)`  
**Description:** Adds an extra lecture for a specific user on a given date within a semester.  
**Parameters:**  
- `userID` (string, required): Unique identifier of the user.  
- `lecture` (object, required): Lecture object containing details.  
- `semester` (string, required): The semester for which the lecture is added.  
- `date` (string, required, format: dd/mm/yyyy): The date for which the lecture is added.  
**Response:**
```json
{
  "status": 200,
  "message": "Lecture added successfully",
  "data": {}
}
```

---

### 3. Modify Attendance
**Endpoint:** `modifyAttendance(userID, to, from, date, courseCode, status)`  
**Description:** Updates the attendance status for a specific lecture.  
**Parameters:**  
- `userID` (string, required): Unique identifier of the user.  
- `to` (string, required, format: HH:mm): End time of the lecture in 24-hour format.  
- `from` (string, required, format: HH:mm): Start time of the lecture in 24-hour format.  
- `date` (string, required, format: dd/mm/yyyy): The date of the lecture.  
- `courseCode` (string, required): The course code of the lecture.  
- `status` (string, nullable, required): Attendance status (`null`, `present`, `absent`, `medical`, `cancelled`).  
**Response:**
```json
{
  "status": 200,
  "message": "Attendance marked successfully",
  "data": []
}
```

---

### 4. Get Attendance Report
**Endpoint:** `getAttendanceReport(userID, semester)`  
**Description:** Retrieves the attendance report for a specific user within a semester.  
**Parameters:**  
- `userID` (string, required): Unique identifier of the user.  
- `semester` (string, required): The semester for which the report is generated.  
**Response:**
```json
{
  "status": 200,
  "message": "Attendance report",
  "data": [
    {
      "courseCode": "",
      "presentPercentage": 0,
      "absentPercentage": 0,
      "maximumAchievableAttendance": 0,
      "minimumLecturesToAttend": 0
    }
  ]
}
```

