import styles from "./DetailInfo.module.scss";
import { Box, Container } from "@mui/material";
import { useAppSelector } from "../../../rtk/hooks";
import {
  selectDataForRender,
  IDataForRender,
  selectDetailIsActive,
} from "../../../rtk/slices/requestSlice";
import StarIcon from "@mui/icons-material/Star";

interface IDetailInfo {
  isActive: boolean;
  id: string;
}

// возвращает размету для отображения деталей о выбранном репозитории
export default function DetailInfo(props: IDetailInfo) {
  const { isActive, id } = props;
  const dataForRender: IDataForRender[] = useAppSelector(selectDataForRender);
  const isActiveFromeStore = useAppSelector(selectDetailIsActive);

  return isActive && isActiveFromeStore ? (
    <Container
      style={{
        width: "33vw",
        background: "#F2F2F2",
        fontFamily: "Roboto",
        fontWeight: 400,
      }}
    >
      {dataForRender.map((elem: IDataForRender) => {
        if (elem.id === id) {
          return (
            <Box display="flex" flexDirection="column" key={elem.id}>
              <h1 className={styles.name}>{elem.name}</h1>
              <div className={styles.detail}>
                <div className={styles.language}>
                  {elem.languages.nodes[0]
                    ? elem.languages.nodes[0].name
                    : "Н/Д"}
                </div>
                <div className={styles.stars} style={{ color: "#FFB400" }}>
                  <StarIcon color="inherit" />
                  <div>{elem.stargazers.totalCount}</div>
                </div>
              </div>
              <ul className={styles.languages}>
                {elem.languages.nodes
                  ? elem.languages.nodes.map((el: { name: string }) => {
                      return <li key={el.name}>{el.name}</li>;
                    })
                  : null}
              </ul>
              <div className={styles.license}>{elem.licenseInfo?.name}</div>
            </Box>
          );
        }
      })}
    </Container>
  ) : (
    <div className={styles.detailbasic}>
      <h5>Выберите репозиторий</h5>
    </div>
  );
}
