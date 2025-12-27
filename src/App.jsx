import { useEffect, useRef, useState } from "react";

const evaluationWeeks = [
  "أكتوبر 1","أكتوبر 2","أكتوبر 3","أكتوبر 4",
  "نوفمبر 1","نوفمبر 2","نوفمبر 3","نوفمبر 4",
  "ديسمبر 1","ديسمبر 2","ديسمبر 3","ديسمبر 4",
];

const homeworkWeeks = [
  "سبتمبر 1","سبتمبر 2",
  "أكتوبر 1","أكتوبر 2","أكتوبر 3","أكتوبر 4",
  "نوفمبر 1","نوفمبر 2","نوفمبر 3","نوفمبر 4",
  "ديسمبر 1","ديسمبر 2","ديسمبر 3","ديسمبر 4",
];

export default function App() {
  const totalInputs =
    evaluationWeeks.length +
    homeworkWeeks.length * 2 +
    3; // tests + final exam

  const inputRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const [evaluation, setEvaluation] = useState(Array(12).fill(""));
  const [homework, setHomework] = useState(Array(14).fill(""));
  const [behavior, setBehavior] = useState(Array(14).fill(""));
  const [octTest, setOctTest] = useState("");
  const [novTest, setNovTest] = useState("");
  const [finalExam, setFinalExam] = useState("");

  useEffect(() => {
    inputRefs.current[focusIndex]?.focus();
  }, [focusIndex]);

  const moveNext = () => {
    if (focusIndex < totalInputs - 1) {
      setFocusIndex(focusIndex + 1);
    }
  };

  const sum = (arr) =>
    arr.reduce((a, b) => a + (Number(b) || 0), 0);

  const evalAvg = sum(evaluation) / 12;
  const hwAvg = sum(homework) / 14;
  const behAvg = sum(behavior) / 14;
  const schoolWork = evalAvg + hwAvg + behAvg;
  const testsAvg = (Number(octTest || 0) + Number(novTest || 0)) / 2;
  const totalBeforeExam = schoolWork + testsAvg;
  const finalTotal = totalBeforeExam + Number(finalExam || 0);

  let refIndex = 0;

  const renderInputs = (arr, setArr) =>
    arr.map((val, i) => {
      const idx = refIndex++;
      return (
        <input
          key={i}
          type="number"
          className="form-control"
          value={val}
          ref={(el) => (inputRefs.current[idx] = el)}
          onChange={(e) => {
            const copy = [...arr];
            copy[i] = e.target.value;
            setArr(copy);
          }}
          onBlur={moveNext}
        />
      );
    });

  return (
    <div className="container my-3">
      <h4 className="text-center mb-4">حساب درجات أعمال السنة</h4>

      {/* Evaluation */}
      <Card title="التقييم الأسبوعي (12)">
        <Grid labels={evaluationWeeks}>
          {renderInputs(evaluation, setEvaluation)}
        </Grid>
      </Card>

      {/* Homework */}
      <Card title="الواجبات (14)">
        <Grid labels={homeworkWeeks}>
          {renderInputs(homework, setHomework)}
        </Grid>
      </Card>

      {/* Behavior */}
      <Card title="السلوك والمواظبة (14)">
        <Grid labels={homeworkWeeks}>
          {renderInputs(behavior, setBehavior)}
        </Grid>
      </Card>

      {/* Tests */}
      <Card title="الاختبارات الشهرية">
        <div className="row g-2">
          {[octTest, novTest].map((val, i) => {
            const idx = refIndex++;
            return (
              <div className="col-6" key={i}>
                <input
                  type="number"
                  className="form-control"
                  placeholder={i === 0 ? "اختبار أكتوبر" : "اختبار نوفمبر"}
                  value={val}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onChange={(e) =>
                    i === 0 ? setOctTest(e.target.value) : setNovTest(e.target.value)
                  }
                  onBlur={moveNext}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Results */}
      <Card title="النتائج">
        <p>متوسط التقييم: {evalAvg.toFixed(2)}</p>
        <p>متوسط الواجب: {hwAvg.toFixed(2)}</p>
        <p>متوسط السلوك: {behAvg.toFixed(2)}</p>
        <hr />
        <p>مجموع أعمال السنة: {schoolWork.toFixed(2)}</p>
        <p>متوسط الاختبارين: {testsAvg.toFixed(2)}</p>
        <p>المجموع قبل الامتحان: {totalBeforeExam.toFixed(2)}</p>

        <input
          type="number"
          className="form-control my-2"
          placeholder="امتحان الفصل (30)"
          value={finalExam}
          ref={(el) => (inputRefs.current[refIndex] = el)}
          onChange={(e) => setFinalExam(e.target.value)}
        />

        <h5 className="text-center mt-3">
          المجموع النهائي: {finalTotal.toFixed(2)}
        </h5>
      </Card>

      <button className="btn btn-primary w-100" onClick={() => window.print()}>
        طباعة
      </button>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Card({ title, children }) {
  return (
    <div className="card mb-3">
      <div className="card-header text-center fw-bold">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function Grid({ labels, children }) {
  return (
    <div className="row g-2">
      {labels.map((label, i) => (
        <div className="col-6 col-md-3" key={i}>
          <small>{label}</small>
          {children[i]}
        </div>
      ))}
    </div>
  );
}
