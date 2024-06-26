# tiarafudousan.github.io

TODO:

- [ ] cf simulation
- [ ] loan simulation
- [ ] 減価償却
- [x] 積算評価
- [ ] 収益評価
  - [ ] 入居率 75％で黒字
  - [ ] 金融機関計算方法 - 収益評価、担保評価
- [ ] 物件管理シート

TODO:

- CAPEX
- 売却益試算
- 経費率
- 物件売却利回り（期待利益率）年率+
- 期待売却金額
- 売却金額

### Cash flow tree

```
GPI
EGI
NOI = EGI - OPEX
NCF = NOI - CAPEX
BTCF = NCF - ADS
ATCF = BTCF - tax

# TODO: NCF
taxable income = taxable in - taxable out
               = BTCF - depreciatin + principal
               = NCF - depreciation - interest

tax = taxable income * tax rate
cf = cash in - cash out - tax

cash in = rental income
cash out = opex + capex + ads
taxable in = rental income
taxable out = opex + capex + interest + deficit carry forward?

cash in
- OPEX
- CAPEX
- principal
- interest
-------------
BTCF

cash in
- OPEX
- CAPEX
- interest
- depreciation
-------------
- tax
-------------
ATCF

CCR > FCR > K%
```

| Word | Def | JP | Equation |
| --- | --- | --- | --- |
| GPI | Gross potential income | 総潜在収入 |  |
| EGI | Effective gross income | 実効総収入 | GPI - 空室 - 未収損 + 雑収入 |
| OPEX | Operating expenses | 事業経費 |  |
| CAPEX | Capital expenses | 資本的支出 (大規模修繕) |  |
| NOI | Net operating income | 営業純利益 | EGI - OPEX |
| NCF | Net cash flow |  | NOI - CAPEX |
| ADS | Annual debt service | 年間負債支払額 |  |
| BTCF | Before tax cash flow | 税引前 CF | NCF - ADS |
| ATCF | After tax cash flow | 税引後 CF |  |
| LB | Loan balance | ローン残債 |
| K% | Loan constant | ローン定数 | ADS / LB |
| FCR | Free and clear return | 総収益率 | NOI / (property price + misc costs) |
| CCR | Cash on cash return | 自己資金配当率 | BTCF / cash invested |
| BER | Beak even ratio | 損益分岐点 | (OPEX + ADS) / GPI |
| DCR | Debt coverage ratio | 債務回収比率 | NOI / ADS |

TODO: equations page

```
# ROE - return on equity 自己資本利益率
# ROA - return on asset 総資産利益率
# IRR - internal rate of return 内部収益率
# gross yield - 表面利回り = 満室想定賃料 / 物件価格
# net yield - 純利回り = (年間賃料収入 - 経費) / 物件価格

# NOI - net operating income
# in = rental incomes
# out = 管理費, 保険, 広告費,現状回復費,固定資産税,都市計画税
# excluded = 物件取得諸経費,減価償却,借入元本返済,金利支払、など
# cap rate = NOI / property price

# NAV = net asset value = 純資産価値
# FCR = free and clear return = 総収益率
#     = noi / (property price + misc costs)

# 税務上の利益 = NOI - 金利支払い - 減価償却費
# 税引後利益 = 税務上の利益 - 税金
# 税引後CF = 税引後利益 - ローン元金支払い + 減価償却費

### 購入諸経費一覧 ###
# - 売買契約印紙代
# - 銀行金消契約印紙代
# - 抵当権設定費用
# - 所有権移転登録免許税
# - 司法書士報酬
# - 仲介手数料
# - 不動産所得税
# - その他
```

```
実勢価格 - 実際に売買取引されている相場水準の価格
公示価格 - 国土交通省が発表している土地の単価 - 実勢価格の50～90％程度 (K <= 0.5M, 0.9M)
相続税路線価 - 公示価格の80%程度 毎年更新 (S = 0.8K)
固定資産税路線価 - 公示価格の70%程度 3年に一度更新 (P = 0.7K)
```
