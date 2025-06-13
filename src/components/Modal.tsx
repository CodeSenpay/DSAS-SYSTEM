import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
function CustomModal({
  isOpen,
  handleClose,
  children,
}: {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}) {
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "5px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <CancelIcon onClick={handleClose} className="hover:cursor-pointer" />
        <Box sx={{ p: 4 }} className="bg-amber-500 w-full">
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
