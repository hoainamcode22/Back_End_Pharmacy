import React from "react";
import { useParams } from "react-router-dom";

export default function PrescriptionDetail() {
  const { id } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h1>Prescription Detail (placeholder)</h1>
      <p>Prescription id: {id}</p>
    </div>
  );
}
