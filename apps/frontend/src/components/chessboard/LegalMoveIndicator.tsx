const LegalMoveIndicator = ({
  isPiece
}: {
  isPiece: boolean;
}) => {
  return (
    <div className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {isPiece ? (
        <div
          className={`border-[#628047] bg-red-500 w-5 h-5 rounded-full`}
        />
      ) : (
        <div
          className={`w-5 h-5 bg-slate-700 rounded-full`}
        />
      )}
    </div>
  );
};

export default LegalMoveIndicator;
