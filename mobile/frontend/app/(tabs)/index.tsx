
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import axios from "axios";

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(API_URL);
      setStocks(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStocks();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />;
  }

  const getStockRecommendation = (stock) => {
    if (!stock || stock.price === undefined || stock.change === undefined) return "Không rõ";

    const isIncreasing = stock.changePercent > 1;
    const isHighVolume = stock.volume > 1000000; // 1 triệu
    const isStable = Math.abs(stock.changePercent) < 5; // Không biến động quá mạnh

    if (isIncreasing && isHighVolume && isStable) return "✅ Mua";
    if (!isStable) return "⚠️ Rủi ro";
    return "⏳ Chờ thêm";
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.container}>
      <Text style={styles.title}>📊 Thống kê chứng khoán & AI đề xuất</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>Mã CP</Text>
          <Text style={[styles.cell, styles.headerText]}>Giá ($)</Text>
          <Text style={[styles.cell, styles.headerText]}>Thay đổi</Text>
          <Text style={[styles.cell, styles.headerText]}>% Thay đổi</Text>
          <Text style={[styles.cell, styles.headerText]}>Khối lượng</Text>
          <Text style={[styles.cell, styles.headerText]}>Đề xuất</Text>
        </View>

        {stocks.map((item) => (
          <View key={item.symbol} style={styles.row}>
            <Text style={[styles.cell, styles.symbol]}>{item.symbol}</Text>
            <Text style={styles.cell}>{item.price ? `$${item.price.toFixed(2)}` : "N/A"}</Text>
            <Text style={[styles.cell, item.change > 0 ? styles.green : styles.red]}>
              {item.change ? `${item.change.toFixed(2)}` : "N/A"}
            </Text>
            <Text style={[styles.cell, item.changePercent > 0 ? styles.green : styles.red]}>
              {item.changePercent ? `${item.changePercent.toFixed(2)}%` : "N/A"}
            </Text>
            <Text style={styles.cell}>{item.volume ? item.volume.toLocaleString() : "N/A"}</Text>
            <Text style={styles.cell}>{getStockRecommendation(item)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
  },
  header: {
    backgroundColor: "#333",
  },
  headerText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  cell: {
    flex: 1,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  symbol: {
    fontWeight: "bold",
    color: "#00ffff",
  },
  green: {
    color: "lime",
  },
  red: {
    color: "red",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StockAnalysis;