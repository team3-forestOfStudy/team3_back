import * as studyService from "../services/study.service.js";

// 🖼️ 프론트에서 사용하는 배경 이미지 목록
const ALLOWED_BACKGROUND_IMAGES = [
  "green",
  "yellow",
  "blue",
  "pink",
  "workspace_1",
  "workspace_2",
  "pattern",
  "leaf",
];

// 📘 스터디 생성 컨트롤러 (POST /api/studies)
export async function createStudy(req, res, next) {
  try {
    const {
      nickname,
      title,
      description,
      backgroundImage,
      password,
      passwordConfirm,
    } = req.body;

    // 1. 유효성 검사
    if (
      !nickname?.trim() ||
      !title?.trim() ||
      !password?.trim() ||
      !passwordConfirm?.trim()
    ) {
      return res.status(400).send({
        result: "fail",
        message:
          "닉네임, 스터디 이름, 비밀번호, 비밀번호 확인은 필수로 작성해야합니다.",
        data: null,
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).send({
        result: "fail",
        message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        data: null,
      });
    }

    if (
      backgroundImage &&
      !ALLOWED_BACKGROUND_IMAGES.includes(backgroundImage)
    ) {
      return res.status(400).send({
        result: "fail",
        message: "맞지 않는 배경 이미지입니다.",
        data: null,
      });
    }

    // 2. service 호출 → DB에 스터디 생성
    const newStudy = await studyService.createStudy({
      nickname,
      title,
      description,
      backgroundImage,
      password, // service에서 암호화!
    });

    // 3. 응답 반환 (비밀번호 관련 정보는 절대 보내지 않기!)
    return res.status(201).send({
      result: "success",
      message: "스터디가 성공적으로 생성되었습니다!",
      data: {
        studyId: newStudy.studyId,
        nickname: newStudy.nickname,
        title: newStudy.title,
        description: newStudy.description,
        backgroundImage: newStudy.backgroundImage,
        totalPoints: newStudy.totalPoints,
        status: newStudy.status,
        createdAt: newStudy.createdAt,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}

// 📘 스터디 상세 조회 컨트롤러 (GET /api/studies/:studyId)
export async function getStudyDetail(req, res, next) {
  try {
    const { studyId } = req.params;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // 2. service 호출 → studyId로 DB 조회
    const study = await studyService.getStudyDetail(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 3. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "스터디가 성공적으로 조회되었습니다!",
      data: study,
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}

// 📘 스터디 목록 조회 컨트롤러 (GET /api/studies)
export async function getStudyList(req, res, next) {
  try {
    const { page = "1", pageSize = "6", keyword, sort = "recent" } = req.query;

    // 쿼리 파라미터는 문자열이기 때문에 숫자로 변환!
    const pageNumber = Number(page);
    const pageSizeNumber = Number(pageSize);

    // 1. 유효성 검사
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber <= 0 ||
      !Number.isInteger(pageSizeNumber) ||
      pageSizeNumber <= 0
    ) {
      return res.status(400).send({
        result: "fail",
        message: "page와 pageSize는 1이상의 정수이어야 합니다.",
        data: null,
      });
    } // (Number.isInteger는 값이 정수인지 확인하는 자바스크립트 메소드)

    const safePageSize = Math.min(pageSizeNumber, 30); // 한 번에 너무 큰 pageSize를 불러오면 무리가 되니까 안전하게 상한을 두기!

    // 2. service 호출 → 조건에 맞는 DB 조회
    const { studies, pagination } = await studyService.getStudyList({
      page: pageNumber,
      pageSize: safePageSize,
      keyword,
      sort,
    });

    // 3. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "스터디 목록이 성공적으로 조회되었습니다!",
      data: {
        studies,
        pagination,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}

// 🔐 비밀번호 확인 전용 컨트롤러 (POST /api/studies/:studyId/verify-password)
export async function verifyStudyPassword(req, res, next) {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // 비밀번호 필수 검사
    if (!password?.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "비밀번호를 입력해주세요.",
        data: null,
      });
    }

    // 2. 권한 확인
    const checkResult = await studyService.checkStudyPassword(id, password);

    if (!checkResult.ok && checkResult.reason === "NOT_FOUND") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    if (!checkResult.ok && checkResult.reason === "WRONG_PASSWORD") {
      return res.status(403).send({
        result: "fail",
        message: "비밀번호가 일치하지 않습니다.",
        data: null,
      });
    }

    // 3. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "비밀번호가 확인되었습니다.",
      data: {
        studyId: checkResult.study.studyId,
        nickname: checkResult.study.nickname,
        title: checkResult.study.title,
      },
    });
  } catch (error) {
    next(error);
  }
}

// 📘 스터디 수정 컨트롤러 (PATCH /api/studies/:studyId)
export async function updateStudy(req, res, next) {
  try {
    const { studyId } = req.params;
    const { nickname, title, description, backgroundImage, password } =
      req.body;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // 수정 시 비밀번호 입력은 필수
    if (!password?.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "수정을 위해 비밀번호를 입력해주세요",
        data: null,
      });
    }

    // 수정할 값이 하나라도 있는지 체크 (nickname, title, description, backgroundImage 중에서)
    if (
      nickname === undefined &&
      title === undefined &&
      description === undefined &&
      backgroundImage === undefined
    ) {
      return res.status(400).send({
        result: "fail",
        message: "수정할 값이 최소 1개 이상이어야 합니다",
        data: null,
      });
    }

    // backgroundImage 확인
    if (
      backgroundImage &&
      !ALLOWED_BACKGROUND_IMAGES.includes(backgroundImage)
    ) {
      return res.status(400).send({
        result: "fail",
        message: "맞지 않는 배경 이미지입니다.",
        data: null,
      });
    }

    // 2. 권한 확인
    const checkPassword = await studyService.checkStudyPassword(id, password);

    if (!checkPassword.ok && checkPassword.reason === "NOT_FOUND") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    if (!checkPassword.ok && checkPassword.reason === "WRONG_PASSWORD") {
      return res.status(403).send({
        result: "fail",
        message: "비밀번호가 일치하지 않습니다.",
        data: null,
      });
    }

    // 3. DB 수정 처리
    const updatedData = await studyService.updateStudy(id, {
      nickname,
      title,
      description,
      backgroundImage,
    });

    // 4. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "스터디가 성공적으로 수정되었습니다!",
      data: {
        studyId: updatedData.studyId,
        nickname: updatedData.nickname,
        title: updatedData.title,
        description: updatedData.description,
        backgroundImage: updatedData.backgroundImage,
        totalPoints: updatedData.totalPoints,
        status: updatedData.status,
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}

// 📘 스터디 삭제 컨트롤러 (DELETE /api/studies/:studyId)
export async function deleteStudy(req, res, next) {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // 삭제 시 비밀번호 입력은 필수
    if (!password?.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "삭제를 위해 비밀번호를 입력해주세요",
        data: null,
      });
    }

    // 2. 권한 확인
    const checkPassword = await studyService.checkStudyPassword(id, password);

    if (!checkPassword.ok && checkPassword.reason === "NOT_FOUND") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    if (!checkPassword.ok && checkPassword.reason === "WRONG_PASSWORD") {
      return res.status(403).send({
        result: "fail",
        message: "비밀번호가 일치하지 않습니다.",
        data: null,
      });
    }

    // 3. DB 삭제 처리
    const deletedData = await studyService.deleteStudy(id);

    // 4. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "스터디가 성공적으로 삭제되었습니다!",
      data: {
        studyId: deletedData.studyId,
        status: deletedData.status,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}
