class ReminderService {
  constructor() {
    this.subscribers = [];
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter((sub) => sub !== fn);
  }

  notify(tasks) {
    this.subscribers.forEach((fn) => fn(tasks));
  }
}

const reminderService = new ReminderService();

export default reminderService;
