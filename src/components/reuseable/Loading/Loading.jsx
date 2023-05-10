import "./Loading_Styling/Loading_Style.css";
export default function Loading() {
  return (
    <div className="lds-ring-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
