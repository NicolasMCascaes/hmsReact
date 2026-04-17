const Appointments = () => {
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  };
  const card = (app: any) =>{
    return ( 
          <div className="p-3 mb-3 border rounded-xl">
            <div className="flex justify-between p-5 items-center">

            </div>
          </div>
    )
  }
  
  return (
    <div className="p-3 border rounded-xl bg-violet-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold ">Consultas de hoje</div>
    </div>
  );
};

export default Appointments;
