# Modules & Key Functions

This project is organized as a single JavaScript module (inline in [index.html](file:///workspace/index.html)), but the functions group naturally into functional modules.

## Utilities

- DOM helper: `el(id)` ([index.html:L336-L336](file:///workspace/index.html#L336-L336))
- Navigation/router: `ir(t)` ([index.html:L338-L342](file:///workspace/index.html#L338-L342))
- Date helpers:
  - `hojeISO()` ([index.html:L344-L346](file:///workspace/index.html#L344-L346))
  - `mesAtualISO()` ([index.html:L348-L350](file:///workspace/index.html#L348-L350))
  - `mesmoMes(data,mes)` ([index.html:L352-L354](file:///workspace/index.html#L352-L354))
- Identifiers / normalization: `gerarId(nome)` ([index.html:L356-L358](file:///workspace/index.html#L356-L358))
- Number parsing/formatting:
  - `numeroBR(valor)` parses common pt-BR number formats ([index.html:L360-L437](file:///workspace/index.html#L360-L437))
  - `dinheiroBR(valor)` ([index.html:L439-L443](file:///workspace/index.html#L439-L443))
  - `formatarNumeroBR(numero,casas)` ([index.html:L445-L448](file:///workspace/index.html#L445-L448))

## Storage layer (localStorage)

Simple getter/setter wrappers define the persistence contract:

- Products: `getProdutos()` / `setProdutos(lista)` ([index.html:L512-L513](file:///workspace/index.html#L512-L513))
- Breaks (Quebras): `getQuebras()` / `setQuebras(lista)` ([index.html:L514-L515](file:///workspace/index.html#L514-L515))
- Sales (Vendas): `getVendas()` / `setVendas(lista)` ([index.html:L516-L517](file:///workspace/index.html#L516-L517))

## Product base & migration

- `BASE_VERSION` defines a migration/version key ([index.html:L271-L271](file:///workspace/index.html#L271-L271))
- `baseFLV` is the built-in initial product list ([index.html:L273-L328](file:///workspace/index.html#L273-L328))
- `carregarBase()`:
  - On version change: merges the built-in base with any previously stored per-product fields (e.g., cost)
  - On same version: sorts existing stored products
  - See: [index.html:L519-L543](file:///workspace/index.html#L519-L543)

## Product management (“Cadastro de Produtos”)

Main flows:

- Open screen + initialize: `abrirCadastro()` ([index.html:L545-L550](file:///workspace/index.html#L545-L550))
- Autocomplete by name/code: `autoCadastroProduto()` ([index.html:L566-L588](file:///workspace/index.html#L566-L588))
- Select a product and populate form: `selecionarProdutoCadastro(p)` ([index.html:L552-L564](file:///workspace/index.html#L552-L564))
- Save changes: `salvarProduto()` ([index.html:L633-L679](file:///workspace/index.html#L633-L679))
- Delete: `excluirProduto(id)` ([index.html:L681-L694](file:///workspace/index.html#L681-L694))
- Rendering:
  - `renderListaProdutos()` renders the editable product list ([index.html:L590-L631](file:///workspace/index.html#L590-L631))
  - `limparCamposProduto()` resets the form ([index.html:L696-L706](file:///workspace/index.html#L696-L706))

Cost calculation helpers:

- `calcularCustoProduto()` supports “unit price” and “packaging/box” cost modes ([index.html:L470-L497](file:///workspace/index.html#L470-L497))
- `formatarMoedaCentavosCampo(campo)` formats a currency input by digits-as-cents ([index.html:L457-L467](file:///workspace/index.html#L457-L467))

## Tratativa (compose + WhatsApp send)

Tratativa is a two-step flow:

1. Compose message from product/code/quantities:
   - `salvarTratativa()` builds `textoFinal` and navigates to the “Envio” screen ([index.html:L1425-L1446](file:///workspace/index.html#L1425-L1446))
2. Send text via WhatsApp deep-link:
   - `enviarTexto()` opens `https://wa.me/?text=...` ([index.html:L1448-L1454](file:///workspace/index.html#L1448-L1454))

Finalization:

- `finalizarTratativa()` stores the composed message + attached photo metadata into an in-memory list (`banco`) and resets the form ([index.html:L1456-L1477](file:///workspace/index.html#L1456-L1477))
- `atualizarLista()` renders `banco` into tela7 (“Lista”) ([index.html:L1479-L1510](file:///workspace/index.html#L1479-L1510))

Photo selection and sharing:

- `addFotos(evento,tipo)` reads `<input type="file">` selections and builds previews ([index.html:L1352-L1366](file:///workspace/index.html#L1352-L1366))
- `montarFotosEnvio()` renders photos into tela3 with per-photo “share” buttons ([index.html:L1368-L1404](file:///workspace/index.html#L1368-L1404))
- `compartilharFoto(tipo,index,btn)` uses Web Share API (`navigator.share`) ([index.html:L1406-L1423](file:///workspace/index.html#L1406-L1423))

## Quebra do Dia (break tracking) & Tratativa results

Break entry:

- Open screen: `abrirQuebraDia()` ([index.html:L798-L803](file:///workspace/index.html#L798-L803))
- Add/edit: `adicionarOuEditarQuebra()` ([index.html:L819-L881](file:///workspace/index.html#L819-L881))
- List rendering: `renderListaQuebraDia()` ([index.html:L883-L925](file:///workspace/index.html#L883-L925))
- Edit/delete: `editarQuebra(id)`, `excluirQuebra(id)` ([index.html:L927-L976](file:///workspace/index.html#L927-L976))

Linking a break to a tratativa:

- `enviarQuebraParaTratativa(id)` flags the break as sent (`marcadoTratativa=true`) and pre-fills the tratativa form ([index.html:L944-L961](file:///workspace/index.html#L944-L961))

Tratativa outcome tracking (APROVADO / PARCIAL / REPROVADO):

- Screen open + render: `abrirResultadoTratativa()`, `renderResultadoTratativa()` ([index.html:L978-L1049](file:///workspace/index.html#L978-L1049))
- Status transitions:
  - `aprovarTratativa(id)` ([index.html:L1051-L1063](file:///workspace/index.html#L1051-L1063))
  - `aprovarParcial(id)` ([index.html:L1065-L1106](file:///workspace/index.html#L1065-L1106))
  - `reprovarTratativa(id)` ([index.html:L1108-L1120](file:///workspace/index.html#L1108-L1120))
  - `excluirTratativa(id)` removes the break entry from storage ([index.html:L1122-L1130](file:///workspace/index.html#L1122-L1130))

## Vendas (sales) & monthly/dashboard calculations

Sales entry:

- Open screen: `abrirVendaDia()` ([index.html:L1242-L1247](file:///workspace/index.html#L1242-L1247))
- Save/update: `salvarVenda()` ([index.html:L1256-L1288](file:///workspace/index.html#L1256-L1288))
- List rendering + edit/delete: `renderListaVendas()`, `editarVenda(id)`, `excluirVenda(id)` ([index.html:L1290-L1350](file:///workspace/index.html#L1290-L1350))

Aggregations:

- Monthly: `calcularResultadoMensal()` computes totals and meta status ([index.html:L1211-L1240](file:///workspace/index.html#L1211-L1240))
- Dashboard: `abrirDashboard()` computes totals, index, status label, and top-5 products by break value ([index.html:L1136-L1210](file:///workspace/index.html#L1136-L1210))

## Premium gating

Premium is controlled via `localStorage` expiry:

- `premiumAtivo()` checks `premiumVencimento` timestamp ([index.html:L1511-L1519](file:///workspace/index.html#L1511-L1519))
- `ativarPremium()` unlocks premium when the user enters code `FLV15` (31-day expiry) ([index.html:L1521-L1538](file:///workspace/index.html#L1521-L1538))
- `bind()` hides premium screens/buttons when not active ([index.html:L1587-L1597](file:///workspace/index.html#L1587-L1597))

## Wiring / controller entrypoints

- `bind()` attaches all event handlers and performs feature gating ([index.html:L1539-L1640](file:///workspace/index.html#L1539-L1640))
- `registrarServiceWorker()` registers [sw.js](file:///workspace/sw.js) ([index.html:L1642-L1646](file:///workspace/index.html#L1642-L1646))

