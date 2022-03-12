import {
  makeStyles,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
} from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";
import {
  useBlockchains,
  useBlockchainLogo,
  useTotalBalance,
  useTotalLast24HrChange,
  useBlockchainTokensSorted,
} from "../../hooks/useBlockchainBalances";

const useStyles = makeStyles((theme: any) => ({
  logoIcon: {
    width: "44px",
    height: "44px",
  },
  tokenListItem: {
    borderTop: `solid 1pt ${theme.custom.colors.border}`,
    height: "68px",
  },
  blockchainCard: {
    backgroundColor: theme.custom.colors.nav,
    marginBottom: "12px",
    marginLeft: "12px",
    marginRight: "12px",
    borderRadius: "12px",
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.15)",
  },
  blockchainFooter: {
    borderTop: `solid 1pt ${theme.custom.colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "6px",
    paddingBottom: "6px",
    height: "36px",
  },
  footerArrowIcon: {
    width: "10px",
    color: theme.custom.colors.secondary,
  },
  footerLabel: {
    fontSize: "14px",
    weight: 500,
    color: theme.custom.colors.fontColor,
  },
  cardContentRoot: {
    padding: "0 !important",
  },
  blockchainLogo: {
    width: "12px",
  },
  cardHeaderRoot: {
    padding: "6px",
    paddingLeft: "16px",
    paddingRight: "16px",
    height: "36px",
  },
  cardHeaderTitle: {
    fontWeight: 500,
    fontSize: "14px",
  },
  cardListRoot: {
    padding: "0 !important",
  },
  cardHeaderContent: {
    color: theme.custom.colors.fontColor,
  },
  tokenListItemContent: {
    color: theme.custom.colors.fontColor,
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  tokenName: {
    height: "24px",
    fontWeight: 500,
    fontSize: "16px",
    maxWidth: "200px",
    overflow: "hidden",
    color: theme.custom.colors.fontColor,
  },
  tokenAmount: {
    fontWeight: 500,
    fontSize: "12px",
    color: theme.custom.colors.secondary,
  },
  tokenBalance: {
    fontWeight: 500,
    fontSize: "16px",
    color: theme.custom.colors.fontColor,
  },
  tokenBalanceChange: {
    fontWeight: 500,
    fontSize: "12px",
    color: theme.custom.colors.secondary,
    float: "right",
  },
  balancesHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  headerLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: theme.custom.colors.secondary,
  },
  totalBalance: {
    fontWeight: 500,
    fontSize: "20px",
    color: theme.custom.colors.fontColor,
  },
  positive: {
    color: theme.custom.colors.positive,
    fontSize: "12px",
  },
  negative: {
    color: theme.custom.colors.negative,
    fontSize: "12px",
  },
}));

export function Balances() {
  const blockchains = useBlockchains();
  return (
    <div>
      <BalancesHeader />
      {blockchains.map((b) => (
        <BlockchainCard key={b} blockchain={b} />
      ))}
    </div>
  );
}

function BalancesHeader() {
  const classes = useStyles();
  const totalBalance = useTotalBalance();
  const [last24Notional, last24Percent] = useTotalLast24HrChange();
  return (
    <div className={classes.balancesHeaderContainer}>
      <div>
        <Typography className={classes.headerLabel}>Total Balance</Typography>
        <Typography className={classes.totalBalance}>
          ${totalBalance.toLocaleString()}
        </Typography>
      </div>
      <div>
        <Typography className={classes.headerLabel}>Last 24 hrs</Typography>
        <Typography
          className={last24Percent > 0 ? classes.positive : classes.negative}
        >
          {last24Notional} ({last24Percent}%)
        </Typography>
      </div>
    </div>
  );
}

function BlockchainCard({ blockchain }: { blockchain: string }) {
  const classes = useStyles();
  const blockchainLogo = useBlockchainLogo(blockchain);
  const blockchainDisplay =
    blockchain.slice(0, 1).toUpperCase() + blockchain.toLowerCase().slice(1);
  const tokenAccountsSorted = useBlockchainTokensSorted(blockchain);
  return (
    <Card className={classes.blockchainCard} elevation={0}>
      <CardHeader
        avatar={<img className={classes.blockchainLogo} src={blockchainLogo} />}
        title={blockchainDisplay}
        classes={{
          root: classes.cardHeaderRoot,
          content: classes.cardHeaderContent,
          title: classes.cardHeaderTitle,
        }}
      />
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <List classes={{ root: classes.cardListRoot }}>
          {tokenAccountsSorted.slice(0, 3).map((token) => (
            <TokenListItem key={token.address} token={token} />
          ))}
          {tokenAccountsSorted.length > 3 && (
            <BlockchainCardFooter
              blockchain={blockchain}
              tokenCount={tokenAccountsSorted.length}
            />
          )}
        </List>
      </CardContent>
    </Card>
  );
}

function TokenListItem({ token }: { token: any }) {
  const classes = useStyles();
  if (token.nativeBalance === 0) {
    return <></>;
  }
  return (
    <ListItem button disableRipple className={classes.tokenListItem}>
      <ListItemIcon>
        <img src={token.logo} className={classes.logoIcon} />
      </ListItemIcon>
      <div className={classes.tokenListItemContent}>
        <div>
          <Typography className={classes.tokenName}>{token.name}</Typography>
          <Typography className={classes.tokenAmount}>
            {token.nativeBalance} {token.ticker}
          </Typography>
        </div>
        <div>
          <Typography className={classes.tokenBalance}>
            ${token.usdBalance}
          </Typography>
          <Typography className={classes.tokenBalanceChange}>
            ${token.recentUsdBalanceChange}
          </Typography>
        </div>
      </div>
    </ListItem>
  );
}

function BlockchainCardFooter({
  blockchain,
  tokenCount,
}: {
  blockchain: string;
  tokenCount: number;
}) {
  const classes = useStyles();
  return (
    <ListItem button disableRipple className={classes.blockchainFooter}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.footerLabel}>
          Show all {tokenCount}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <ArrowForwardIos className={classes.footerArrowIcon} />
      </div>
    </ListItem>
  );
}
