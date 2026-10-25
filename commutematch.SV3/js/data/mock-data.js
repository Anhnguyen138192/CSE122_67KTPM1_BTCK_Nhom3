/**
 * CommuteMatch initial accounts and empty operational data.
 * Existing browser accounts and user-created records are kept by storage.js.
 */

window.COMMUTE_MOCK_DATA = {
  users: [
    {
      id: "u_rider1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@sinhvien.edu.vn",
      password: "password123",
      role: "rider",
      roleLabel: "Hành khách",
      avatar: "NA",
      avatarColor: "#059669"
    },
    {
      id: "u_driver1",
      name: "Trần Minh Quân",
      email: "quan.tran@sinhvien.edu.vn",
      password: "password123",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "MQ",
      avatarColor: "#0d9488"
    },
    {
      id: "u_driver2",
      name: "Lê Hoàng Phúc",
      email: "phuc.le@alumni.edu.vn",
      password: "password123",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "HP",
      avatarColor: "#2563eb"
    },
    {
      id: "u_coord1",
      name: "Đặng Thùy Trang",
      email: "trang.coord@commutematch.edu.vn",
      password: "password123",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "TT",
      avatarColor: "#7c3aed"
    },
    {
      id: "u_admin1",
      name: "Ban Quản Trị Hệ Thống",
      email: "admin@commutematch.edu.vn",
      password: "adminpassword",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "AD",
      avatarColor: "#dc2626"
    },
    {
      id: "u_longchieusigma",
      username: "longchieusigma",
      name: "Long Chieu Sigma",
      email: "longchieusigma@commutematch.local",
      password: "longchieusigma",
      phone: "",
      role: "superadmin",
      roles: ["rider", "driver", "coordinator", "admin", "superadmin"],
      roleLabel: "Super Admin",
      avatar: "LS",
      avatarColor: "#4c1d95"
    }
  ],
  trips: [],
  joinRequests: [],
  roleApplications: [],
  pickupZones: [],
  reports: [],
  ratings: [],
  settings: {
    maxFarePerKm: 3500,
    maxFareCarPerKm: 8000,
    maxDetourRadiusKm: 2.5,
    minTrustScoreToShare: 80,
    aiWeightRouteMatch: 50,
    aiWeightTimeDelta: 30,
    aiWeightDriverRating: 20,
    platformStatus: "operational",
    allowRecurringTrips: true
  },
  notifications: [],
  messages: [],
  auditLogs: []
};
