const HowTo = () => {
  return (
    <div className="p-4 mt-4">
      <h1 className="text-4xl text-center font-semibold mb-6">
        Rada partnerstva
      </h1>

      <div className="container">
        <p>
          Rada partnerstva je uznášaniaschopná, ak je prítomná nadpolovičná
          väčšina členov Rady partnerstva. Hlasovanie prebieha dvoma spôsobmi, a
          to:
        </p>
        <ul className="list-disc pl-5">
          <li className="border-b border-gray-300 py-2">
            rovným hlasovaním, pri ktorom má každý člen Rady partnerstva jeden
            rovný hlas; na schválenie návrhu uznesenia alebo jeho časti je
            potrebný súhlas nadpolovičnej väčšiny hlasov prítomných členov Rady
            partnerstva
          </li>

          <li className=" py-2">
            váženým hlasovaním, rozhodnutia v komore sa prijímajú na základe
            jednoduchej väčšiny, ktorá predstavuje 51% váhy hlasov a zároveň
            súhlasom minimálne 50% hlasujúcich členov
          </li>
        </ul>
        <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
          <div className="flex md:contents">
            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
              <div className="h-full w-6 flex items-center justify-center">
                <div className="h-full w-1 bg-green-500 pointer-events-none"></div>
              </div>
              <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center">
                <i className="fas fa-check-circle text-white"></i>
              </div>
            </div>
            <div className="bg-green-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
              <h3 className="font-semibold text-lg mb-1">
                Vyberte typ hlasovania v hlavnom menu
              </h3>
              <p className="leading-tight text-justify w-full">
                Rovné hlasovanie alebo Vážené hlasovanie
              </p>
            </div>
          </div>

          <div className="flex md:contents">
            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
              <div className="h-full w-6 flex items-center justify-center">
                <div className="h-full w-1 bg-green-500 pointer-events-none"></div>
              </div>
              <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center">
                <i className="fas fa-check-circle text-white"></i>
              </div>
            </div>
            <div className="bg-green-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
              <h3 className="font-semibold text-lg mb-1">Zvoľte hlasovanie</h3>
              <p className="leading-tight text-justify">
                v ponuke vyberte hlasovanie podľa názvu
              </p>
            </div>
          </div>

          <div className="flex md:contents">
            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
              <div className="h-full w-6 flex items-center justify-center">
                <div className="h-full w-1 bg-red-500 pointer-events-none"></div>
              </div>
              <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-red-500 shadow text-center">
                <i className="fas fa-times-circle text-white"></i>
              </div>
            </div>
            <div className="bg-red-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
              <h3 className="font-semibold text-lg mb-1 text-gray-50">
                Označte jednu z možností
              </h3>
              <p className="leading-tight text-justify">
                označte ZA , PROTI alebo ZDRŽAL SA
              </p>
            </div>
          </div>

          <div className="flex md:contents">
            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
              <div className="h-full w-6 flex items-center justify-center">
                <div className="h-full w-1 bg-blue-500 pointer-events-none"></div>
              </div>
              <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-blue-500 shadow text-center">
                <i className="fas fa-exclamation-circle text-gray-400"></i>
              </div>
            </div>
            <div className="bg-blue-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
              <h3 className="font-semibold text-lg mb-1 text-white">
                STLAČTE HLASUJ
              </h3>
              <p className="leading-tight text-justify"></p>
            </div>
          </div>
          <div className="flex md:contents">
            <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
              <div className="h-full w-6 flex items-center justify-center">
                <div className="h-full w-1 bg-slate-400 pointer-events-none"></div>
              </div>
              <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-slate-400 shadow text-center">
                <i className="fas fa-exclamation-circle text-gray-400"></i>
              </div>
            </div>
            <div className="bg-slate-400 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
              <h3 className="font-semibold text-lg mb-1 text-white">
                Po odoslaní hlasu sa zmení farba tlačítka na sivú, hlasovať je
                možné 1x za vybraté hlasovanie
              </h3>
              <p className="leading-tight text-justify"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
