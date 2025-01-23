export default function Vote({ text, percentage, votes }) {
  return (
    <div className="votes">
      <input
        className="appearance-none"
        type="radio"
        name="vote"
        value={text}
        id={text}
      />
      <label
        htmlFor={text}
        className="bg-white block rounded border-4 border-transparent cursor-pointer shadow-lg p-6"
      >
        <p className="text-2xl font-bold flex items-center justify-between">
          {text}
          {/* <span>{percentage || 0}%</span> */}
        </p>

        <progress
          className="w-full h-2 rounded-lg appearance-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:bg-blue-500 [&::-webkit-progress-value]:rounded-lg [&::-moz-progress-bar]:bg-gray-200"
          value={percentage}
          max="100"
        >
          {percentage}%
        </progress>

        {/*  <small className="text-slate-500">{votes} hlasov</small> */}
      </label>
    </div>
  );
}
