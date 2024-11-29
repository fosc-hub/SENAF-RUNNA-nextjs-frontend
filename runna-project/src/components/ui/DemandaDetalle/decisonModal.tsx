import React from "react"
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"

interface DecisionData {
  decision: string
  reason: string
  "Demanda Scores": {
    score: number
    score_condiciones_vulnerabilidad: number
    score_vulneracion: number
    score_motivos_intervencion: number
    score_indicadores_valoracion: number
  }
  "NNyA Scores": {
    score: number
    score_condiciones_vulnerabilidad: number
    score_vulneracion: number
    score_motivos_intervencion: number
  }
}

export function DecisionModal() {
  const decisionData: DecisionData = {
    "decision": "APERTURA DE LEGAJO",
    "reason": "Dado el alto score del nnya (540.0), y el alto score de la demanda (313.47208744746933), la decision sugerida es APERTURA DE LEGAJO.",
    "Demanda Scores": {
      "score": 313.47208744746933,
      "score_condiciones_vulnerabilidad": 36.231406655148916,
      "score_vulneracion": 242.96558530951827,
      "score_motivos_intervencion": 183.03492646394966,
      "score_indicadores_valoracion": 22.630204318773078
    },
    "NNyA Scores": {
      "score": 540.0,
      "score_condiciones_vulnerabilidad": 0.0,
      "score_vulneracion": 540.0,
      "score_motivos_intervencion": 0.0
    }
  }

  const renderScoreTable = (scores: Record<string, number>, title: string) => (
    <>
      <Typography variant="h6" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Métrica</TableCell>
              <TableCell align="right">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(scores).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                </TableCell>
                <TableCell align="right">{value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Decisión: {decisionData.decision}
      </Typography>
      <Typography variant="body1" paragraph>
        {decisionData.reason}
      </Typography>
      {renderScoreTable(decisionData["Demanda Scores"], "Demanda Scores")}
      {renderScoreTable(decisionData["NNyA Scores"], "NNyA Scores")}
    </div>
  )
}

