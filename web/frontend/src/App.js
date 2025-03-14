import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockAnalysis.css";

const STOCKS = [
  "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "NFLX", "BABA", "INTC",
  "AMD", "PYPL", "CSCO", "ORCL", "IBM", "QCOM", "ADBE", "CRM", "TXN", "BA",
  "NKE", "KO", "PEP", "PFE", "JNJ", "MRNA", "LLY", "UNH", "ABBV", "GILD",
  "XOM", "CVX", "BP", "T", "VZ", "TMUS", "GE", "HON", "CAT", "MMM",
  "GS", "JPM", "MS", "BAC", "WFC", "C", "BLK", "AXP", "V", "MA",
  "HD", "LOW", "COST", "TGT", "WMT", "DG", "DLTR", "SBUX", "MCD", "YUM",
  "DIS", "CMCSA", "NFLX", "T", "VZ", "WBD", "TWTR", "SNAP", "UBER", "LYFT",
  "SQ", "SHOP", "SE", "BIDU", "JD", "PDD", "NIO", "XPEV", "LI", "TSM",
  "ASML", "AVGO", "MU", "LRCX", "KLAC", "AMAT", "NXPI", "STM", "SWKS", "QRVO",
  "FDX", "UPS", "DAL", "AAL", "UAL", "LUV", "RCL", "CCL", "NCLH", "EXPE",
  "BKNG", "MAR", "HLT", "H", "W", "TOL", "LEN", "DHI", "PHM", "KBH",
  "MO", "PM", "STZ", "BUD", "DEO", "KHC", "GIS", "CPB", "K", "MDLZ",
  "HSY", "HRL", "SJM", "EL", "PG", "CL", "KMB", "CHD", "UL", "NSRGY",
  "TSLA", "RIVN", "LCID", "FSR", "WKHS", "XPEV", "LI", "NIO", "F", "GM",
  "HMC", "TM", "NSANY", "TTM", "AZO", "AAP", "ORLY", "KMX", "AN", "GPC",
  "MMM", "ITW", "SWK", "JCI", "ROK", "EMR", "DOV", "PH", "ETN", "HON",
  "CAT", "DE", "AGCO", "LMT", "NOC", "BA", "RTX", "GD", "TXT", "HII",
  "CVX", "XOM", "COP", "OXY", "EOG", "PXD", "MRO", "DVN", "APA", "FANG",
  "BP", "RDS.A", "RDS.B", "TOT", "EQNR", "ENB", "TRP", "KMI", "WMB", "ET",
  "TRGP", "OKE", "EPD", "MMP", "PAA", "BKR", "HAL", "SLB", "FTI", "FMC",
  "MOS", "CF", "NTR", "SQM", "ICL", "CE", "EMN", "WLK", "LYB", "DOW",
  "PPG", "SHW", "RPM", "ECL", "ALB", "LTHM", "PLL", "LLY", "BIIB", "REGN",
  "VRTX", "BMY", "PFE", "MRNA", "AZN", "GILD", "ABBV", "GSK", "NVS", "SNY",
  "JPM", "BAC", "C", "WFC", "GS", "MS", "BLK", "TROW", "BEN", "STT",
  "USB", "PNC", "TFC", "RF", "FITB", "HBAN", "KEY", "MTB", "CMA", "ZION"
];

const API_KEY = "KkOYKg38DKVZsYWqyM7L8fxajBUINP8h";
const API_URL = `https://financialmodelingprep.com/api/v3/quote/${STOCKS.join(",")}?apikey=${API_KEY}`;
const StockAnalysis = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu API
      setStocks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };
  

  const getStockRecommendation = (stock) => {
    if (!stock || stock.price === undefined || stock.change === undefined) return "Không rõ";
    const isIncreasing = stock.changePercent > 1;
    const isHighVolume = stock.volume > 1000000;
    const isStable = Math.abs(stock.changePercent) < 5;
    if (isIncreasing && isHighVolume && isStable) return "✅ Mua";
    if (!isStable) return "⚠️ Rủi ro";
    return "⏳ Chờ thêm";
  };

  const filteredStocks = stocks.filter((stock) => {
    if (search && !stock.symbol.includes(search.toUpperCase())) return false;
    if (filter === "up" && stock.changePercent <= 0) return false;
    if (filter === "down" && stock.changePercent >= 0) return false;
    if (filter === "stable" && Math.abs(stock.changePercent) >= 5) return false;
    return true;
  });

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "change") return b.changePercent - a.changePercent;
    if (sortBy === "volume") return b.volume - a.volume;
    return 0;
  });

  return (
    <div className="stock-container">
      <h1>📊 Thống kê chứng khoán & AI đề xuất</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔎 Tìm kiếm mã CP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="up">📈 Tăng</option>
          <option value="down">📉 Giảm</option>
          <option value="stable">🔄 Ổn định</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="price">💰 Giá cao nhất</option>
          <option value="change">📊 % Thay đổi</option>
          <option value="volume">📦 Khối lượng</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Mã CP</th>
              <th>Giá ($)</th>
              <th>Thay đổi</th>
              <th>% Thay đổi</th>
              <th>Khối lượng</th>
              <th>Đề xuất</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((item) => (
              <tr key={item.symbol}>
                <td className="symbol">{item.symbol}</td>
                <td>${item.price ? item.price.toFixed(2) : "N/A"}</td>
                <td className={item.change > 0 ? "green" : "red"}>
                  {item.change ? item.change.toFixed(2) : "N/A"}
                </td>
                <td className={item.changePercent > 0 ? "green" : "red"}>
                  {item.changePercent ? item.changePercent.toFixed(2) + "%" : "N/A"}
                </td>
                <td>{item.volume ? item.volume.toLocaleString() : "N/A"}</td>
                <td>{getStockRecommendation(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockAnalysis;