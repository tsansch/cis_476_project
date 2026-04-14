const repeatStrategy = {
  daily: (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  },

  weekly: (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  },

  monthly: (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  },
};

export default repeatStrategy;
