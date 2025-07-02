const IMGBB_API_KEY = "798d07a97949f4bf700c4c7f81aee4ed";

export async function uploadToImgBB(file) {
    if (!file) {
        throw new Error('Dosya seçilmedi');
    }

    // Dosya boyutu kontrolü (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz');
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yüklenebilir');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        console.log('ImgBB\'ye yükleniyor...', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('ImgBB Yanıtı:', data);

        if (data.success) {
            console.log('Yükleme başarılı, URL:', data.data.url);
            return data.data.url;
        } else {
            console.error('ImgBB Hatası:', data.error);
            throw new Error(data.error?.message || 'Görsel yükleme başarısız');
        }
    } catch (error) {
        console.error('ImgBB Yükleme Hatası:', error);
        throw new Error(`Görsel yüklenirken hata oluştu: ${error.message}`);
    }
} 