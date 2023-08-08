import { post } from "@/utils/request";

export default {
  list: (query) => post("/api/student/education/subject/list"),
  alllist: (query) => post("/api/admin/education/subject/list"),
  select: (id) => post("/api/student/education/subject/select/" + id),
};
