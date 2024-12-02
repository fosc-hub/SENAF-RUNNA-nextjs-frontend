import { Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

interface EvaluarButtonProps {
  onClick: () => void;
}

const EvaluarButton: React.FC<EvaluarButtonProps> = ({ onClick }) => {


  return (
    <Button
      variant="contained"
      startIcon={<CreateIcon />}
      sx={{
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#45a049',
        },
        borderRadius: '8px',
        textTransform: 'none',
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
      }}
      href='/evaluaciones'
    >
      Evaluar
    </Button>
  );
};

export default EvaluarButton;
