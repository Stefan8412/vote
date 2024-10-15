export default function Vote({ text, percentage, votes }) {
  return (
    <div className="flex justify-between items-center">
      <p>{text}</p>
      <p>
        {votes} votes ({percentage}%)
      </p>
    </div>
  );
}
