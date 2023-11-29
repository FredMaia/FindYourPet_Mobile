import React, { useContext } from "react";
import RoutesBottom from "./routesBottom";
import Routes from "./routes";
import { AuthContext } from "./contexts/auth";

const TrocarNavegador = () => {
    const { estaLogado } = useContext(AuthContext);
    return estaLogado ? <RoutesBottom /> : <Routes />;
}

export default TrocarNavegador;