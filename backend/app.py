from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="VirtualShopAgent API", version="0.1.0")


class RenderRequest(BaseModel):
    product_url: HttpUrl
    product_title: str
    product_image_url: HttpUrl
    category_hint: str = "auto"


@app.get('/health')
def health() -> dict:
    return {"status": "ok"}


@app.post('/vto/render')
def render_vto(payload: RenderRequest) -> dict:
    """Temporary mocked endpoint for extension integration testing."""
    _ = payload
    return {
        "result_image_url": "https://picsum.photos/900/1200",
        "status": "mocked"
    }
